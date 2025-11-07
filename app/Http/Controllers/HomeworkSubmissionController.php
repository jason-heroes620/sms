<?php

namespace App\Http\Controllers;

use App\Models\Tenant\ClassStudent;
use App\Models\Tenant\Homeworks;
use App\Models\Tenant\HomeworkSubmissionList as TenantHomeworkSubmissionList;
use App\Models\Tenant\HomeworkSubmissions;
use App\Models\Tenant\Students;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomeworkSubmissionController extends Controller
{

    public function index(Request $request)
    {
        $homework = Homeworks::select(['homework_id', 'homework_date', 'class_name', 'subject_name', 'section_name', 'classes.class_id', 'sections.section_id'])
            ->leftJoin('classes', 'homeworks.class_id', 'classes.class_id')
            ->leftJoin('sections', 'homeworks.section_id', 'sections.section_id')
            ->leftJoin('subjects', 'homeworks.subject_id', 'subjects.subject_id')
            ->where('homework_id', $request->id)->first();
        Log::info($homework);
        return Inertia::render('Base/Homeworks/Submissions', compact('homework'));
    }

    public function showAll(Request $request)
    {
        $class = Homeworks::select('class_id', 'section_id')
            ->where('homework_id', $request->id)
            ->first();
        $query = ClassStudent::select('last_name', 'first_name', 'students.student_id')
            ->leftJoin('students', 'class_student.student_id', 'students.student_id')
            ->where('class_id', $class->class_id)
            ->where('section_id', $class->section_id);

        if ($request->has('filters')) {
            foreach ($request->filters as $column => $value) {
                if ($value !== null) {
                    $query->where($column, $value);
                }
            }
        }
        if ($request->has('sort')) {
            $query->orderBy($request->sort['field'], $request->sort['direction']);
        }
        // else {
        //     $query->orderBy('homework_submissions.created_at', 'desc');
        // }

        $perPage = $request->per_page ?? 10;
        $homeworks = $query->paginate($perPage);

        foreach ($homeworks as $homework) {
            $homework->submissions = HomeworkSubmissions::select('marks', 'comments', 'homework_submission_id', 'created_at')
                ->where('homework_id', $request->id)
                ->where('student_id', $homework->student_id)
                ->first();
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

    public function update(Request $request)
    {
        try {
            $submission = HomeworkSubmissions::find($request->id);
            $submission->update([
                'marks' => $request->marks,
                'comments' => $request->comments,
            ]);
        } catch (Exception $e) {
            Log::error('Submission comment update error.' . $e);
        }
    }

    public function show(Request $request)
    {
        $filename = TenantHomeworkSubmissionList::select('file_path')->where('homework_submission_id', $request->id)->first()->file_path;
        if (!Storage::disk('public')->exists($filename)) {
            abort(404);
        }

        $path = Storage::disk('public')->path($filename);

        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
        ]);
    }
}
