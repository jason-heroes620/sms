<?php

namespace App\Http\Controllers;

use App\Models\Tenant\BranchClass;
use App\Models\Tenant\Branches;
use App\Models\Tenant\Exams;
use App\Models\Tenant\TimetableDetails;
use App\Models\Tenant\Timetables;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ExamController extends Controller
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
        return Inertia::render('Base/Exam/Exams', [
            'exams' => [],
        ]);
    }

    public function showAll(Request $request)
    {
        // This method should return a paginated list of exams based on the request parameters.
        // For now, we will return an empty array as a placeholder.
        $exams = Exams::select(['exam_id', 'exam_name', 'exam_description', 'start_date', 'end_date', 'subject_name', 'class_name'])
            ->leftJoin('classes', 'classes.class_id', 'exams.class_id')
            ->leftJoin('subjects', 'subjects.subject_id', 'exams.subject_id');

        if ($request->has('search')) {
            $search = $request->input('search');
            $exams->where('exam_name', 'like', '%' . $search . '%')
                ->orWhere('exam_description', 'like', '%' . $search . '%');
        }
        if ($request->has('filters')) {
            foreach ($request->filters as $column => $value) {
                if ($value !== null) {
                    $exams->where($column, $value);
                }
            }
        }
        if ($request->has('sort')) {
            $exams->orderBy($request->sort['field'], $request->sort['direction']);
        } else {
            $exams->orderBy('exams.created_at', 'desc');
        }
        $perPage = $request->per_page ?? 10;
        $exams = $exams->paginate($perPage);

        return response()->json([
            'data' => $exams->items(),
            'meta' => [
                'current_page' => $exams->currentPage(),
                'last_page' => $exams->lastPage(),
                'per_page' => $exams->perPage(),
                'total' => $exams->total(),
                'from' => $exams->firstItem(),
                'to' => $exams->lastItem(),
            ],
        ]);
    }

    public function create()
    {
        $user = Auth::id();
        $branches = $this->branches;
        $classes = BranchClass::getCustomClassesByBranchIds($user);
        foreach ($classes as $class) {
            $subjects = TimetableDetails::select('subjects.subject_id', 'subject_name')
                ->leftjoin('subjects', 'subjects.subject_id', '=', 'timetable_details.subject_id')
                ->whereIn('class_id', $class->pluck('class_id'))
                ->where('timetable_details.timetable_detail_status', 'active')
                ->get();
            $class['subjects'] = $subjects;
        }

        return Inertia::render('Base/Exam/AddExam', compact('branches', 'classes'));
    }

    public function store(Request $request)
    {
        try {
            $user = $request->user();
            $request->validate([
                'exam_name' => 'required|string|max:100',
                'exam_description' => 'required|string',
                'start_date' => 'required|date',
                'class_id' => 'required|exists:classes,class_id',
                'subject_id' => 'required|exists:subjects,subject_id',
                'end_date' => 'required|date|after_or_equal:startDate',
            ]);

            Exams::create([
                'exam_name' => $request->exam_name,
                'exam_description' => $request->exam_description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'created_by' => $user->id,
                'class_id' => $request->class_id,
                'subject_id' => $request->subject_id,
            ]);
            return redirect()->back()->with('success', 'Exam created successfully');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Failed to create exam: ' . $e);
        }
    }

    public function edit($id)
    {
        $user = Auth::id();
        $branches = $this->branches;
        $classes = BranchClass::getCustomClassesByBranchIds($user);
        foreach ($classes as $class) {
            $subjects = TimetableDetails::select('subjects.subject_id', 'subject_name')
                ->leftjoin('subjects', 'subjects.subject_id', '=', 'timetable_details.subject_id')
                ->where('class_id', $class->class_id)
                ->where('timetable_details.timetable_detail_status', 'active')
                ->get();
            $class['subjects'] = $subjects;
        }

        $exam = Exams::select(['exam_id', 'exam_name', 'exam_description', 'start_date', 'end_date', 'subject_id', 'class_id'])
            ->where('exam_id', $id)
            ->first();
        $exam['branch_id'] = BranchClass::select('branch_id')
            ->where('class_id', $exam->class_id)
            ->first()->branch_id;

        return Inertia::render('Base/Exam/EditExam', compact('branches', 'classes', 'exam'));
    }

    public function update(Request $request, $id)
    {
        try {
            Exams::where('exam_id', $id)->update([
                'exam_name' => $request->exam_name,
                'exam_description' => $request->exam_description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'class_id' => $request->class_id,
                'subject_id' => $request->subject_id,
            ]);

            return redirect()->back()->with('success', 'Exam updated successfully');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Failed to update exam: ' . $e);
        }
    }

    public function examResults($id)
    {
        $exam = Exams::select(['exam_id', 'exam_name', 'exam_description', 'start_date', 'end_date', 'subject_name', 'class_name', 'exams.class_id'])
            ->leftJoin('classes', 'classes.class_id', 'exams.class_id')
            ->leftJoin('subjects', 'subjects.subject_id', 'exams.subject_id')
            ->where('exam_id', $id)
            ->first();

        $exam['branch_name'] = BranchClass::select('branch_name')
            ->leftJoin('branches', 'branches.branch_id', 'branch_class.branch_id')
            ->where('class_id', $exam->class_id)
            ->first()->branch_name;

        return Inertia::render('Base/Exam/ExamResults', compact('exam'));
    }
}
