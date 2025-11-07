<?php

namespace App\Http\Controllers;

use App\Models\Tenant\ClassStudent;
use App\Models\Tenant\ExamResults;
use App\Models\Tenant\Exams;
use App\Models\Tenant\Grades;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExamResultsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getStudentListByClass(Request $request)
    {
        $class = Exams::select('class_id')->where('exam_id', $request->id)->first();

        $students = ClassStudent::select('class_student.student_id', DB::raw("concat(students.last_name, ' ', students.first_name) as student_name"), DB::raw("concat(classes.class_name, ' (', sections.section_name, ')') as class_name"), 'marks', 'comments', 'grade')
            ->leftJoin('students', 'students.student_id', 'class_student.student_id')
            ->leftJoin('classes', 'classes.class_id', 'class_student.class_id')
            ->leftJoin('sections', 'sections.section_id', 'class_student.section_id')
            ->leftJoin('exam_results', 'exam_results.student_id', 'class_student.student_id')
            ->where('class_student.class_id', $class->class_id);

        if ($request->has('search')) {
            $search = $request->input('search');
            $students->where('last_name', 'like', '%' . $search . '%')
                ->orWhere('first_name', 'like', '%' . $search . '%');
        }
        if ($request->has('filters')) {
            foreach ($request->filters as $column => $value) {
                if ($value !== null) {
                    $students->where($column, $value);
                }
            }
        }
        if ($request->has('sort')) {
            $students->orderBy($request->sort['field'], $request->sort['direction']);
        } else {
            $students->orderBy('student_name', 'desc');
        }
        $perPage = $request->per_page ?? 10;
        $students = $students->paginate($perPage);

        return response()->json([
            'data' => $students->items(),
            'meta' => [
                'current_page' => $students->currentPage(),
                'last_page' => $students->lastPage(),
                'per_page' => $students->perPage(),
                'total' => $students->total(),
                'from' => $students->firstItem(),
                'to' => $students->lastItem(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ExamResults $examResults)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExamResults $examResults)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateStudentResult(Request $request)
    {
        $grade = Grades::select('grade_name')
            ->where('min_mark', '<=', $request->marks)
            ->where('max_mark', '>=', $request->marks)
            ->first()->grade_name;
        try {
            ExamResults::updateOrCreate([
                'exam_id' => $request->exam_id,
                'student_id' => $request->id,
            ], [
                'marks' => $request->marks,
                'comments' => $request->comments,
                'grade' => $grade,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExamResults $examResults)
    {
        //
    }
}
