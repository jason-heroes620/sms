<?php

namespace App\Http\Controllers;

use App\Models\Tenant\ClassStudent;
use App\Models\Tenant\Homeworks;
use App\Models\Tenant\HomeworkSubmissions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        $query = HomeworkSubmissions::select('last_name', 'first_name', 'comments', 'marks')
            ->leftJoin('students', 'students.student_id', 'homework_submissions.student_id')
            ->where('homework_submissions.homework_id', $request->id);

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
            $query->orderBy('homework_submissions.created_at', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $homeworks = $query->paginate($perPage);
        Log::info($homeworks);
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
}
