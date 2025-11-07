<?php

namespace App\Http\Controllers;

use App\Models\Tenant\AnnouncementBranch;
use App\Models\Tenant\Announcements;
use App\Models\Tenant\BranchClass;
use App\Models\Tenant\Branches;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Throwable;

class AnnouncementController extends Controller
{
    protected $branchUser, $branches;

    public function __construct(UserController $branchUser)
    {
        $user = Auth::id();
        $this->branchUser = $branchUser;
        $this->branches = Branches::select('branch_id', 'branch_name')
            ->where('branch_status', 'active')
            ->whereIn('branch_id', $this->branchUser->getUserBranchIds($user))
            ->get();
    }

    public function index(Request $request)
    {
        $user = Auth::id();
        $branches = $this->branches;
        // dd($request->id);
        $classes = BranchClass::getCustomClassesByBranchIds($user);
        $query = Announcements::select('announcements.announcement_id', 'title', 'image_path', 'short_description', 'announcements.created_at', 'announcement_status')
            ->distinct()
            ->leftJoin('announcement_branch', 'announcements.announcement_id', 'announcement_branch.announcement_id');

        if ($request->id) {
            $query->where('branch_id', $request->id)->orWhere('branch_id', null);
        } else {
            $query->where('branch_id', null)->orWhereIn('branch_id', $branches->pluck('branch_id'));
        }

        $status = ['draft', 'published'];
        $announcements = $query->whereIn('announcement_status', $status)->paginate(15);

        return Inertia::render(
            'Base/Announcements/Announcement',
            [
                'announcements' => $announcements,
                'branches' => $branches,
                'classes' => $classes,
                'filters' => $request->id,
            ]
        );
    }

    public function create()
    {
        $user = Auth::id();
        $branches = $this->branches->toArray();
        $classes = BranchClass::getCustomClassesByBranchIds($user)->select('label', 'value', 'branch_id');
        array_unshift($branches, ['branch_id' => null, 'branch_name' => 'All Branches']);

        return Inertia::render('Base/Announcements/AddAnnouncement', compact('branches', 'classes'));
    }

    public function store(Request $request)
    {
        $user = Auth::id();
        $branches = $this->branches;
        $classes = BranchClass::getCustomClassesByBranchIds($user)->select('label', 'value', 'branch_id');

        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'image' => 'nullable|image|max:2048',
            ]);
            Log::info($request->all());

            if ($validator->fails()) {
                Log::error($validator->errors());
                return redirect()
                    ->back()
                    ->withErrors($validator)
                    ->withInput();
            }

            $data = $request->all();
            if ($request->hasFile('image')) {
                $data['image_path'] = $request->file('image')->store('announcements', 'public');
            }
            $data['short_description'] = substr($data['description'], 0, 50);
            $data['created_by'] = $user;

            $announcement = Announcements::create($data);
            Log::info('branch ' . $request->input('branch_id'));
            if ($request->input('branch_id') === '') {
                AnnouncementBranch::create([
                    'announcement_id' => $announcement->announcement_id
                ]);
            } else {
                AnnouncementBranch::create([
                    'branch_id' => $request->input('branch_id'),
                    'announcement_id' => $announcement->announcement_id
                ]);
            }

            return redirect()->route('announcement.show', $announcement->announcement_id)->with('success', 'Announcement created.');
        } catch (Exception $e) {
            Log::error($e);
            return back()->with('error', $e->getMessage());
        } catch (Throwable $e) {
            Log::error($e);
            return back()->with('error', $e->getMessage());
        }
    }

    public function edit(Request $request)
    {
        $user = Auth::id();
        $announcement = Announcements::where('announcement_id', $request->id)->first();
        $branch = AnnouncementBranch::where('announcement_id', $request->id)->first();
        if (!$branch) {
            $announcement->branch_id = null;
        } else {
            Log::info($branch);
            $announcement['branch_id'] = $branch->branch_id;
        }

        if ($announcement->image_path !== null) {
            $announcement['image_path'] = asset('storage/' . $announcement->image_path);
        }
        $branches = $this->branches->toArray();
        $classes = BranchClass::getCustomClassesByBranchIds($user)->select('label', 'value', 'branch_id');
        array_unshift($branches, ['branch_id' => null, 'branch_name' => 'All Branches']);

        return Inertia::render('Base/Announcements/EditAnnouncement', compact('branches', 'classes', 'announcement'));
    }

    public function update(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
            ]);
            Log::info('announcement');
            Log::info($request->all());

            if ($validator->fails()) {
                Log::error($validator->errors());
                return redirect()
                    ->back()
                    ->withErrors($validator)
                    ->withInput();
            }

            $data = $request->all();
            if ($request->hasFile('image')) {
                Log::info('image');

                $data['image_path'] = $request->file('image')->store('announcements', 'public');
                Announcements::where('announcement_id', $request->id)->update([
                    'image_path' => $data['image_path'],
                ]);
                Log::info($data['image_path']);
            }
            $data['short_description'] = substr($data['description'], 0, 50);

            $announcement = Announcements::where('announcement_id', $request->id)->update([
                'title' => $data['title'],
                'description' => $data['description'],
                'short_description' => $data['short_description'],
            ]);

            Log::info('announcement ' . $announcement);
            Log::info('branch ' . $request->input('branch_id'));
            if ($request->input('branch_id') === '') {
                AnnouncementBranch::where('announcement_id', $request->id)->update([
                    'branch_id' => null
                ]);
            } else {
                AnnouncementBranch::where('announcement_id', $request->id)->update([
                    'branch_id' => $request->input('branch_id'),
                ]);
            }

            return redirect()->route('announcement.show', $request->id)->with('success', 'Announcement updated.');
        } catch (Exception $e) {
            Log::error($e);
            return back()->with('error', $e->getMessage());
        } catch (Throwable $e) {
            Log::error($e);
            return back()->with('error', $e->getMessage());
        }
    }

    public function show(Request $request)
    {
        $announcement = Announcements::where('announcement_id', $request->id)->first();

        return Inertia::render('Base/Announcements/Show', [
            'announcement' => $announcement,
        ]);
    }

    public function publish(Request $request)
    {
        try {
            $announcement = Announcements::where('announcement_id', $request->id)->update([
                'announcement_status' => 'published'
            ]);
            return redirect()->route('announcement.show', $request->id)->with('success', 'Announcement published.');
        } catch (Exception $e) {
            Log::error($e);
            return back()->with('error', $e->getMessage());
        } catch (Throwable $e) {
            Log::error($e);
            return back()->with('error', $e->getMessage());
        }
    }

    public function archive(Request $request)
    {
        try {
            $announcement = Announcements::where('announcement_id', $request->id)->update([
                'announcement_status' => 'archived'
            ]);
            return redirect()->route('announcement.show', $request->id)->with('success', 'Announcement published.');
        } catch (Exception $e) {
            Log::error($e);
            return back()->with('error', $e->getMessage());
        } catch (Throwable $e) {
            Log::error($e);
            return back()->with('error', $e->getMessage());
        }
    }
}
