<?php

namespace App\Http\Controllers;

use App\Models\Tenant\BranchClass;
use App\Models\Tenant\AcademicYear;
use App\Models\Tenant\Branches;
use App\Models\Tenant\Classes;
use App\Rules\UniqueClassInBranch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Exceptions;
use Inertia\Inertia;

class ClassController extends Controller
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

    public function index()
    {
        $user = Auth::getUser()->id;

        $branches = Branches::select(['branch_id as id', 'branch_name as value'])
            ->where('branch_status', 'active')
            ->whereIn('branch_id', $this->branchUser->getUserBranchIds($user))
            ->get();

        return Inertia::render(
            'Base/Class/Classes',
            compact('branches')
        );
    }

    public function showAll(Request $request)
    {
        $user = Auth::getUser()->id;

        $query = BranchClass::select(['classes.class_id', 'class_name', 'class_description', 'branch_name'])
            ->leftJoin('classes', 'classes.class_id', 'branch_class.class_id')
            ->leftJoin('branches', 'branches.branch_id', 'branch_class.branch_id')
            ->leftJoin('academic_years', 'academic_years.academic_year_id', 'classes.academic_year_id')
            ->where('academic_years.is_current', true)
            ->whereIn('branches.branch_id', $this->branchUser->getUserBranchIds($user));

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('class_name', 'like', '%' . $search . '%')
                ->orWhere('class_description', 'like', '%' . $search . '%');
        }

        if ($request->has('filters')) {
            foreach ($request->filters as $column => $value) {
                if ($value !== null) {
                    $query->where('branch_class.branch_id', $value);
                }
            }
        }

        if ($request->has('sort')) {
            $query->orderBy($request->sort['field'], $request->sort['direction']);
        } else {
            $query->orderBy('classes.created_at', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $classes = $query->paginate($perPage);
        return response()->json([
            'data' => $classes->items(),
            'meta' => [
                'current_page' => $classes->currentPage(),
                'last_page' => $classes->lastPage(),
                'per_page' => $classes->perPage(),
                'total' => $classes->total(),
                'from' => $classes->firstItem(),
                'to' => $classes->lastItem(),
            ],
        ]);
    }

    public function create()
    {
        $user = Auth::id();
        $academic_years = AcademicYear::all();
        $branches = $this->branches;

        return Inertia::render('Base/Class/AddClass', compact('academic_years', 'branches'));
    }

    public function store(Request $request)
    {
        $user = Auth::user()->id;

        try {
            $request->validate([
                'academic_year_id' => 'required|string',
                'class_name' => [
                    'required',
                    'string',
                    'max:50',
                    new UniqueClassInBranch($request->input('branch_id'))
                ],
                'class_description' => 'required|string',
            ]);

            $class = Classes::create([
                'academic_year_id' => $request->academic_year_id,
                'class_name' => $request->class_name,
                'class_description' => $request->class_description
            ]);

            BranchClass::create([
                'class_id' => $class->class_id,
                'branch_id' => $request->branch_id,
                'created_by' => $user
            ]);

            return redirect()->back()->with('success', 'Class created successfully.');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Failed to create class: ' . $e);
        }
    }

    public function edit($id)
    {
        $classes = Classes::findOrFail($id);
        $branches = $this->branches;
        $academic_years = AcademicYear::all();
        $classes['branch_id'] = BranchClass::select('branch_id')->where('class_id', $classes->class_id)->pluck('branch_id')->first();

        return Inertia::render('Base/Class/ViewClass', compact('classes', 'branches', 'academic_years'));
    }

    public function update(Request $request, $id)
    {
        $branch = $request->input('branch_id');
        $request->validate([
            'class_name' => [
                'required',
                'string',
                'max:50',
                new UniqueClassInBranch($branch, $id)
            ],
        ]);

        $class = Classes::findOrFail($id);
        $class->update($request->all());

        return redirect()->back()->with('success', 'Class updated successfully.');
    }

    public function getSubjectsByClass(Request $request)
    {
        $class_id = $request->class_id;
        $subjects = [
            [
                'subject_id' => "112233",
                'subject_name' => 'a'
            ],
            [
                'subject_id' => "223344",
                'subject_name' => 'b'
            ],
        ];
        return response()->json([

            'subjects' => $subjects

        ]);
    }
}
