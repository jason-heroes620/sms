<?php

namespace App\Http\Controllers;

use App\Models\Tenant\AcademicYearClass;
use App\Models\Tenant\Assessments;
use App\Models\Tenant\BranchClass;
use App\Models\Tenant\Branches;
use App\Models\Tenant\ClassStudent;
use App\Models\Tenant\Students;
use App\Models\Tenant\TagGroups;
use App\Models\Tenant\Tags;
use App\Models\Tenant\UserProfiles;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    protected $branchUser, $branches;

    protected $geminiService;

    public function __construct(UserController $branchUser, GeminiService $geminiService)
    {
        $user = Auth::id();
        $this->branchUser = $branchUser;
        $this->branches = Branches::select('branch_id', 'branch_name')
            ->where('branch_status', 'active')
            ->whereIn('branch_id', $this->branchUser->getUserBranchIds($user))
            ->get();

        $this->geminiService = $geminiService;
    }

    public function index()
    {
        return Inertia::render('Base/Assessments/Assessments');
    }

    public function showAll(Request $request)
    {
        $query = Assessments::select(['assessment_id', 'students.first_name as student_first_name', 'students.last_name as student_last_name', 'user_profiles.last_name', 'user_profiles.first_name', 'assessments.created_at', 'comments'])
            ->leftJoin('class_student', 'class_student.class_student_id', 'assessments.class_student_id')
            ->leftJoin('students', 'students.student_id', 'class_student.student_id')
            ->leftJoin('user_profiles', 'user_profiles.user_id', 'assessments.created_by');

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
            $query->orderBy('assessments.created_at', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $assessments = $query->paginate($perPage);
        return response()->json([
            'data' => $assessments->items(),
            'meta' => [
                'current_page' => $assessments->currentPage(),
                'last_page' => $assessments->lastPage(),
                'per_page' => $assessments->perPage(),
                'total' => $assessments->total(),
                'from' => $assessments->firstItem(),
                'to' => $assessments->lastItem(),
            ],
        ]);
    }

    public function create()
    {
        $user = Auth::id();
        $branches = $this->branches;
        $classes = BranchClass::getCustomClassesByBranchIds($user);

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

        return Inertia::render(
            'Base/Assessments/AddAssessment',
            compact('classes', 'tag_groups', 'branches', 'tags')
        );
    }

    public function store(Request $request)
    {
        try {
            $user = Auth::id();
            $request->validate([
                'comments' => 'required|string',
                'class_id' => 'required|string',
            ]);
            $classStudent = ClassStudent::where('class_id', $request->class_id)
                ->where('student_id', $request->student_id)
                ->first()->class_student_id;

            Assessments::create([
                'comments' => $request->comments,
                'class_student_id' => $classStudent,
                'assessment_date' => date('Y-m-d'),
                'created_by' => $user,
            ]);
            return redirect()->back()->with('success', 'Assessment created successfully');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Error saving assessment.');
        }
    }

    public function edit($id)
    {
        $assessment = Assessments::where('assessment_id', $id)->first();
        $assessment['name'] = ClassStudent::select(DB::raw('CONCAT(first_name, " ", last_name) as name'))
            ->leftJoin('students', 'students.student_id', 'class_student.student_id')
            ->where('class_student.class_student_id', $assessment->class_student_id)->first()->name;
        $assessment['assessed_by'] = UserProfiles::select(DB::raw('CONCAT(first_name, " ", last_name) as name'))
            ->where('user_id', $assessment->created_by)->first()->name;
        return Inertia::render('Base/Assessments/EditAssessment', compact('assessment'));
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'comments' => 'required|string',
            ]);
            Assessments::where('assessment_id', $id)->update([
                'comments' => $request->comments,
            ]);
            return redirect()->back()->with('success', 'Assessment updated successfully');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Error updating assessment.');
        }
    }


    public function generateQuery(Request $request)
    {
        Log::info('run gemini query');
        $data = $request->input('tags');
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
}
