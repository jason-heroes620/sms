<?php

namespace App\Http\Controllers;

use App\Models\Tenant\AnnouncementBranch;
use App\Models\Tenant\Announcements;
use App\Models\Tenant\BranchClass;
use App\Models\Tenant\Branches;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

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
        $query = Announcements::select('announcements.announcement_id', 'title', 'image_path', 'short_description', 'created_at')
            ->distinct()
            ->leftJoin('announcement_branch', 'announcements.announcement_id', 'announcement_branch.announcement_id');

        if ($request->id) {
            $query->where('branch_id', $request->id)->orWhere('branch_id', null);
        } else {
            $query->where('branch_id', null)->orWhereIn('branch_id', $branches->pluck('branch_id'));
        }

        $announcements = $query->where('announcement_status', 'active')->paginate(15);

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

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

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

        return redirect()->route('announcements.index')->with('success', 'Announcement created.');
    }

    public function edit(Announcements $announcement)
    {
        return Inertia::render('Announcements/Edit', [
            'announcement' => $announcement,
        ]);
    }

    public function update(Request $request, Announcements $announcement)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string|max:255',
            'content' => 'required|string',
            'announcement_date' => 'required|date',
            'branch_id' => 'nullable|exists:branches,id',
            'class_id' => 'nullable|exists:classes,id',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('announcements', 'public');
        }

        $announcement->update($data);

        return redirect()->route('announcements.index')->with('success', 'Announcement updated.');
    }

    public function show(Request $request)
    {
        $announcement = Announcements::where('announcement_id', $request->id)->first();

        return Inertia::render('Base/Announcements/Show', [
            'announcement' => $announcement,
        ]);
    }
}
