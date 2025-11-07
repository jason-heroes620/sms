<?php

namespace App\Http\Controllers;

use App\Models\Tenant\Assessments;
use App\Models\Tenant\ClassStudent;
use App\Models\Tenant\Students;
use App\Models\Tenant\TagGroups;
use App\Models\Tenant\Tags;
use App\Services\GeminiService;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TagAPIController extends Controller
{
    protected $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    public function getAllTags()
    {
        $tag_groups = TagGroups::select('tag_group_id', 'tag_group', 'tag_color')
            ->where('tag_group_status', 'active')->get();
        $tagsParent = Tags::select('tag_id', 'tag as parent', 'tag_group_id')->where('tag_status', 'active')
            ->where('parent_id', null)
            ->orderBy('tag')->get();
        foreach ($tagsParent as &$tag) {
            $tag['tags'] = Tags::select('tag_id', 'tag')->where('tag_status', 'active')
                ->where('parent_id', $tag['tag_id'])
                ->orderBy('tag')->get();
        }
        unset($tag);
        $tags = $tagsParent;

        return response()->json([
            'tag_groups' => $tag_groups,
            'tags' => $tags
        ]);
    }

    public function generateComment(Request $request)
    {
        $student = Students::select('first_name as name')
            ->where('student_id', $request->input('student_id'))->first();

        $query = "generate a single friendly sentence from these words to describe a teacher's observation of a student, " . $student->name . " that can be sent to parents as an assessment review:" . implode(',', $request->input('tags'));

        $response = $this->geminiService->ask($query);

        if (!$response) {
            return response()->json(['error' => 'Gemini failed to return a valid response'], 500);
        }

        $comment = $response;

        // Save to DB
        Log::info($response);
        return response()->json(compact('comment'));
    }

    public function assessments(Request $request)
    {
        try {
            $user = Auth::id();

            $classStudent = ClassStudent::where('student_id', $request->student_id)
                ->where('class_student_status', 'active')
                ->first()->class_student_id;

            Assessments::create([
                'comments' => $request->description,
                'class_student_id' => $classStudent,
                'assessment_date' => date('Y-m-d'),
                'created_by' => $user,
            ]);
            return redirect()->back()->with('success', 'Assessment created successfully');
        } catch (Exceptions $e) {
            Log::error($e);
            return redirect()->back()->with('error', 'Error saving assessment.');
        }
    }
}
