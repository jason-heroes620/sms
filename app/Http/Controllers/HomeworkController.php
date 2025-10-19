<?php

namespace App\Http\Controllers;

use App\Models\Tenant\BranchClass;
use App\Models\Tenant\Branches;
use App\Models\Tenant\ClassStudent;
use App\Models\Tenant\Homeworks;
use App\Models\Tenant\HomeworkSubmissions;
use App\Models\Tenant\Sections;
use App\Models\Tenant\TimetableDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Exceptions;
use Inertia\Inertia;

class HomeworkController extends Controller
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

    public function index()
    {
        return Inertia::render('Base/Homeworks/Homeworks');
    }

    public function showAll(Request $request)
    {
        $query = Homeworks::select(['homework_id', 'homework_date', 'class_name', 'subject_name', 'section_name', 'first_name', 'last_name', 'classes.class_id', 'sections.section_id'])
            ->leftJoin('classes', 'homeworks.class_id', 'classes.class_id')
            ->leftJoin('sections', 'homeworks.section_id', 'sections.section_id')
            ->leftJoin('subjects', 'homeworks.subject_id', 'subjects.subject_id')
            ->leftJoin('user_profiles', 'user_profiles.user_id', 'homeworks.created_by');

        if ($request->has('filters')) {
            foreach ($request->filters as $column => $value) {
                if ($value !== null) {
                    $query->where($column, $value);
                }
            }
        }
        if ($request->has('sort')) {
            $query->orderBy($request->sort['field'], $request->sort['direction']);
        } else {
            $query->orderBy('homeworks.created_at', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $homeworks = $query->paginate($perPage);
        foreach ($homeworks->items() as $homework) {
            $total_students = ClassStudent::leftJoin('students', 'students.student_id', 'class_student.student_id')
                ->where('class_id', $homework->class_id)
                ->where('section_id', $homework->section_id)
                ->where('students.student_status', 'active')
                ->count();
            $total_submission = HomeworkSubmissions::where('homework_id', $homework->homework_id)
                ->count();
            // Log::info("total_students: " . $total_students . " total_submission: " . $total_submission . " class_id: " . $homework->class_id);
            $homework['submissions'] = $total_submission . '/' . $total_students;
        }

        return response()->json([
            'data' => $homeworks->items(),
            'meta' => [
                'current_page' => $homeworks->currentPage(),
                'last_page' => $homeworks->lastPage(),
                'per_page' => $homeworks->perPage(),
                'total' => $homeworks->total(),
                'from' => $homeworks->firstItem(),
                'to' => $homeworks->lastItem(),
            ],
        ]);
    }

    public function create()
    {
        $user = Auth::id();
        $branches = $this->branches;
        $classes = BranchClass::getCustomClassesByBranchIds($user);

        foreach ($classes as &$class) {
            $class['subjects'] = TimetableDetails::select('subjects.subject_id', 'subject_name')
                ->leftJoin('subjects', 'subjects.subject_id', 'timetable_details.subject_id')
                ->where('timetable_details.class_id', $class['class_id'])
                ->get();
            $class['section'] = Sections::select('section_id', 'section_name', DB::raw("concat(last_name, ' ', first_name) as name"))
                ->leftJoin('user_profiles', 'user_profiles.user_id', 'sections.teacher_in_charge')
                ->where('class_id', $class['class_id'])
                ->get();
        }
        unset($class);

        return Inertia::render('Base/Homeworks/AddHomework', [
            'branches' => $branches,
            'classes' => $classes,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $user = Auth::id();
            $request->validate([
                'homework_description' => 'required|string',
                'homework_date' => 'required|date',
                'class_id' => 'required|string',
                'section_id' => 'required|string',
                'subject_id' => 'required|string',
            ]);

            Homeworks::create([
                'homework_description' => $request->homework_description,
                'homework_date' => $request->homework_date,
                'class_id' => $request->class_id,
                'section_id' => $request->section_id,
                'subject_id' => $request->subject_id,
                'created_by' => $user
            ]);
            return redirect()->back()->with('success', 'Homework created successfully');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Error saving homework.');
        }
    }

    public function edit($id)
    {
        $user = Auth::id();
        $branches = $this->branches;
        $classes = BranchClass::getCustomClassesByBranchIds($user);
        $homework = Homeworks::select(['homework_id', 'homework_description', 'homework_date', 'class_id', 'section_id', 'subject_id'])
            ->where('homework_id', $id)
            ->first();
        $branch = BranchClass::where('class_id', $homework->class_id)->first();

        foreach ($classes as &$class) {
            $class['subjects'] = TimetableDetails::select('subjects.subject_id', 'subject_name')
                ->leftJoin('subjects', 'subjects.subject_id', 'timetable_details.subject_id')
                ->where('timetable_details.class_id', $class['class_id'])
                ->get();
            $class['section'] = Sections::select('section_id', 'section_name', DB::raw("concat(last_name, ' ', first_name) as name"))
                ->leftJoin('user_profiles', 'user_profiles.user_id', 'sections.teacher_in_charge')
                ->where('class_id', $class['class_id'])
                ->get();
        }
        unset($class);
        return Inertia::render('Base/Homeworks/ViewHomework', [
            'branch' => $branch,
            'branches' => $branches,
            'classes' => $classes,
            'homework' => $homework,
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $user = Auth::id();
            $request->validate([
                'homework_description' => 'required|string',
                'homework_date' => 'required|date',
                'class_id' => 'required|string',
                'subject_id' => 'required|string',
            ]);
            Homeworks::where('homework_id', $id)->update([
                'homework_description' => $request->homework_description,
                'homework_date' => $request->homework_date,
                'class_id' => $request->class_id,
                'subject_id' => $request->subject_id,
            ]);
            return redirect()->back()->with('success', 'Homework updated successfully');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Error saving homework.');
        }
    }
}
