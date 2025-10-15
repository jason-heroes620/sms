<?php

namespace App\Http\Controllers;

use App\Models\Tenant\BranchClass;
use App\Models\Tenant\Branches;
use App\Models\Tenant\Classes;
use App\Models\Tenant\Sections;
use App\Models\Tenant\UserProfiles;
use App\Rules\UniqueSectionClassInBranch;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SectionController extends Controller
{
    protected $branchUser, $branches;

    public function __construct(UserController $branchUser)
    {
        $user = Auth::id();
        $this->branchUser = $branchUser;
        $this->branches = Branches::select('branch_id', 'branch_name')
            ->where('branch_status', 'active')
            ->whereIn('branch_id', $this->branchUser->getUserBranchIds($user))
            ->get();;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::id();
        $filterBranches = Branches::select(['branch_id as id', 'branch_name as value'])
            ->where('branch_status', 'active')
            ->whereIn('branch_id', $this->branchUser->getUserBranchIds($user))
            ->get();
        return Inertia::render('Base/Section/Sections', compact('filterBranches'));
    }

    public function showAll(Request $request)
    {
        $query = Sections::select('sections.section_id', 'class_name', 'section_name', 'capacity', DB::raw("concat(last_name, ' ', first_name) as name"))
            ->leftJoin('classes', 'classes.class_id', 'sections.class_id')
            ->leftJoin('branch_class', 'branch_class.class_id', 'classes.class_id')
            ->leftJoin('user_profiles', 'sections.teacher_in_charge', 'user_profiles.user_id')
            ->leftJoin('academic_years', function ($join) {
                $join->on('academic_years.academic_year_id', 'classes.academic_year_id')
                    ->where('academic_years.is_current', 'true');
            });

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('section_name', 'like', '%' . $search . '%');
            $query->orWhere('class_name', 'like', '%' . $search . '%');
        }

        if ($request->has('filters')) {
            foreach ($request->filters as $column => $value) {
                if ($value !== null) {
                    if ($column === 'branch')
                        $query->where('branch_class.branch_id', $value);
                    if ($column === 'class')
                        $query->where('branch_class.class_id', $value);
                }
            }
        }

        if ($request->has('sort')) {
            $query->orderBy($request->sort['field'], $request->sort['direction']);
        } else {
            $query->orderBy('sections.created_at', 'desc');
        }
        $perPage = $request->per_page ?? 10;
        $sections = $query->paginate($perPage);
        return response()->json([
            'data' => $sections->items(),
            'meta' => [
                'current_page' => $sections->currentPage(),
                'last_page' => $sections->lastPage(),
                'per_page' => $sections->perPage(),
                'total' => $sections->total(),
                'from' => $sections->firstItem(),
                'to' => $sections->lastItem(),
            ],
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::id();
        $branches = $this->branches;
        $classes = BranchClass::getCustomClassesByBranchIds($user);

        $teachers = UserProfiles::select(DB::raw("concat(last_name, ' ', first_name) as name"), 'user_profiles.user_id', 'branch_user.branch_id')
            ->leftJoin('branch_user', 'branch_user.user_id', 'user_profiles.user_id')
            ->leftJoin('roles', 'roles.id', 'branch_user.role_id')
            ->where('roles.name', 'teacher')
            ->get();

        return Inertia::render('Base/Section/AddSection', compact('branches', 'classes', 'teachers'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'class_id' => 'required',
                'section_name' => [
                    'required',
                    'string',
                    'max:50',
                    new UniqueSectionClassInBranch($request->input('class_id'))
                ],
                'capacity' => 'required|numeric|min:1|max:100',
                'teacher_in_charge' => 'required'
            ]);

            if ($validator->fails()) {
                return redirect()
                    ->back()
                    ->withErrors($validator)
                    ->withInput();
            }

            Sections::create([
                'class_id' => $request->class_id,
                'section_name' => $request->section_name,
                'capacity' => $request->capacity,
                'teacher_in_charge' => $request->teacher_in_charge
            ]);

            return redirect()->back()->with('success', 'Section created successfully.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Error creating section.');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $section = Sections::where('section_id', $id)->first();
        $user = Auth::id();
        $branches = $this->branches;
        $classes = BranchClass::getCustomClassesByBranchIds($user);

        $section['branch_id'] = BranchClass::where('class_id', $section['class_id'])->pluck('branch_id')->first();

        $teachers = UserProfiles::select(DB::raw("concat(last_name, ' ', first_name) as name"), 'user_profiles.user_id', 'branch_user.branch_id')
            ->leftJoin('branch_user', 'branch_user.user_id', 'user_profiles.user_id')
            ->leftJoin('roles', 'roles.id', 'branch_user.role_id')
            ->where('roles.name', 'teacher')
            ->get();

        return Inertia::render('Base/Section/ViewSection', compact('section', 'classes', 'branches', 'teachers'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'class_id' => 'required',
                'section_name' => [
                    'required',
                    'string',
                    'max:50',
                    new UniqueSectionClassInBranch($request->input('class_id'), $id)
                ],
                'capacity' => 'required|numeric|min:1|max:100',
                'teacher_in_charge' => 'required'
            ]);

            if ($validator->fails()) {
                return redirect()
                    ->back()
                    ->withErrors($validator)
                    ->withInput();
            }


            $section = Sections::findOrFail($id);
            $section->update($request->all());

            return redirect()->back()->with('success', 'Section created successfully.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Error creating section.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sections $sections)
    {
        //
    }
}
