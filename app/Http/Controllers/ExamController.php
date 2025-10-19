<?php

namespace App\Http\Controllers;

use App\Models\Tenant\BranchClass;
use App\Models\Tenant\Branches;
use App\Models\Tenant\Exams;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Exceptions;
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
        $exams = Exams::select(['exam_id', 'exam_name', 'exam_description', 'start_date', 'end_date'])
            ->with('subject', 'class')
            ->orderBy('created_at', 'desc');
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
            $exams->orderBy('created_at', 'desc');
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
                'end_date' => 'required|date|after_or_equal:startDate',
            ]);

            Exams::create([
                'exam_name' => $request->exam_name,
                'exam_description' => $request->exam_description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'created_by' => $user->id,
            ]);
            return redirect()->back()->with('success', 'Exam created successfully');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Failed to create exam: ' . $e);
        }
    }

    public function edit($id)
    {
        // This method should return a view for editing an existing exam.
        // For now, we will return an empty array as a placeholder.
        return Inertia::render('Base/Exam/EditExam', [
            'exam' => [],
        ]);
    }

    public function update(Request $request, $id)
    {
        // This method should handle the logic for updating an existing exam.
        // For now, we will return a success response as a placeholder.
        return response()->json(['message' => 'Exam updated successfully'], 200);
    }
}
