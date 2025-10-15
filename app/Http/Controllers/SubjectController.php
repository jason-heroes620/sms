<?php

namespace App\Http\Controllers;

use App\Models\Tenant\AcademicYear;
use App\Models\Tenant\AcademicYearClass;
use App\Models\Tenant\BranchClass;
use App\Models\Tenant\Branches;
use App\Models\Tenant\Classes;
use App\Models\Tenant\ClassSubject;
use App\Models\Tenant\Sections;
use App\Models\Tenant\Subjects;
use App\Models\Tenant\UserProfiles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Exceptions;
use Inertia\Inertia;

class SubjectController extends Controller
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
        $subjects = Subjects::all();
        return Inertia::render('Base/Subject/Subjects', [
            'subjects' => $subjects,
        ]);
    }

    public function showAll(Request $request)
    {
        $query = Subjects::select(['subject_id', 'subject_name', 'subject_description']);

        if ($request->has('filters')) {
            foreach ($request->filters as $column => $value) {
                if ($value !== null) {
                    $query->where($column, $value);
                }
            }
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('subject_name', 'like', '%' . $search . '%')
                ->orWhere('subject_description', 'like', '%' . $search . '%');
        }

        if ($request->has('sort')) {
            $query->orderBy($request->sort['field'], $request->sort['direction']);
        } else {
            $query->orderBy('subjects.created_at', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $subjects = $query->paginate($perPage);

        return response()->json([
            'data' => $subjects->items(),
            'meta' => [
                'current_page' => $subjects->currentPage(),
                'last_page' => $subjects->lastPage(),
                'per_page' => $subjects->perPage(),
                'total' => $subjects->total(),
                'from' => $subjects->firstItem(),
                'to' => $subjects->lastItem(),
            ],
        ]);
    }

    public function create()
    {
        $classes = AcademicYear::leftJoin('classes', 'academic_years.academic_year_id', '=', 'classes.academic_year_id')
            ->where('academic_years.is_current', true)
            ->select('academic_years.academic_year_id', 'classes.class_name')
            ->get();
        return Inertia::render('Base/Subject/AddSubject', [
            'classes' => $classes,
        ]);
    }

    public function assign(Request $request)
    {
        $user = Auth::id();
        $academic_years = AcademicYear::where('end_date', '>=', now())->get();

        $branches = $this->branches;

        $classes = BranchClass::getCustomClassesByBranchIds($user);
        foreach ($classes as $class) {
            $class['section'] = Sections::select('section_id', 'section_name', DB::raw("concat(last_name, ' ', first_name) as name"))
                ->leftJoin('user_profiles', 'user_profiles.user_id', 'sections.teacher_in_charge')
                ->where('class_id', $class['class_id'])
                ->get();
        }
        $subjects = Subjects::select(['subject_id', 'subject_name'])
            ->where('subject_status', 'active')
            ->get();

        return Inertia::render('Base/Subject/AssignSubject', [
            'academic_years' => $academic_years,
            'branches' => $branches,
            'classes' => $classes,
            'subjects' => $subjects,
        ]);
    }

    public function getClassesByAcademicYear(Request $request)
    {
        $academicYear = $request->input('academicYear');
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'subject_name' => 'required|string|max:100|unique:subjects,subject_name',
                'subject_description' => 'required|string',
            ]);

            Subjects::create([
                'subject_name' => $request->subject_name,
                'subject_description' => $request->subject_description,
            ]);

            return redirect()->back()->with('success', 'Subject created successfully.');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Failed to create subject: ' . $e);
        }
    }

    public function edit($id)
    {
        $subject = Subjects::findOrFail($id);
        return Inertia::render('Base/Subject/ViewSubject', [
            'subject' => $subject,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'subject_name' => 'required|string|max:100|unique:subjects,subject_name',
            'subject_description' => 'required|string',
        ]);

        $subject = Subjects::findOrFail($id);
        $subject->update($request->all());

        return redirect()->back()->with('success', 'Subject updated successfully.');
    }

    public function assignSubjectStore(Request $request)
    {
        foreach ($request->input('subject_id') as $subject) {
            ClassSubject::create([
                'section_id' => $request->input('section_id'),
                'subject_id' => $subject
            ]);
        }
        return redirect()->back()->with('success', '');
    }
}
