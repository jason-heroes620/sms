<?php

namespace App\Http\Controllers;

use App\Models\Tenant\Grades;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Exceptions;
use Inertia\Inertia;

class GradeController extends Controller
{
    public function create()
    {
        $grades = Grades::orderBy('grade_order', 'asc')->get();
        return Inertia::render('Settings/Grades/Grades');
    }

    public function showAll(Request $request)
    {
        // Fetch all grades with pagination and filters
        $query = Grades::select(['grade_id', 'grade_name', 'min_mark', 'max_mark', 'grade_remark', 'grade_order']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('grade_name', 'like', '%' . $search . '%');
        }

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
            $query->orderBy('grade_order', 'asc');
        }

        $perPage = $request->per_page ?? 10;
        $grades = $query->paginate($perPage);

        return response()->json([
            'data' => $grades->items(),
            'meta' => [
                'current_page' => $grades->currentPage(),
                'last_page' => $grades->lastPage(),
                'per_page' => $grades->perPage(),
                'total' => $grades->total(),
                'from' => $grades->firstItem(),
                'to' => $grades->lastItem(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        // Validate and store the grade
        // Redirect or return response
        try {
            $request->validate([
                'gradeName' => 'required|string|max:255',
                'minMark' => 'required|numeric',
                'maxMark' => 'required|numeric|gte:minMark',
                'gradeRemark' => 'nullable|string|max:255',
                'gradeOrder' => 'required|integer',
            ]);
            Grades::create([
                'grade_name' => $request->gradeName,
                'min_mark' => $request->minMark,
                'max_mark' => $request->maxMark,
                'grade_remark' => $request->gradeRemark,
                'grade_order' => $request->gradeOrder,
            ]);
            return redirect()->back()->with('success', 'Grade created successfully.');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Failed to create grade: ' . $e);
        }
    }

    public function edit($id)
    {
        // Fetch the grade by ID and return the edit view
        $grade = Grades::findOrFail($id);
        return Inertia::render('grades.edit', [
            'grade' => $grade,
        ]);
    }

    public function update(Request $request, $id)
    {
        // Validate and update the grade
        // Redirect or return response
        try {
            $request->validate([
                'grade_name' => 'required|string|max:255',
                'min_mark' => 'required|numeric',
                'max_mark' => 'required|numeric|gte:min_mark',
                'grade_remark' => 'nullable|string|max:255',
                'grade_order' => 'required|integer',
            ]);
            $grade = Grades::findOrFail($id);
            $grade->update([
                'grade_name' => $request->grade_name,
                'min_mark' => $request->min_mark,
                'max_mark' => $request->max_mark,
                'grade_remark' => $request->grade_remark,
                'grade_order' => $request->grade_order,
            ]);
            return redirect()->route('grades.index')->with('success', 'Grade updated successfully.');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Failed to update grade: ' . $e);
        }
    }

    public function destroy($id)
    {
        // Delete the grade by ID
        // Redirect or return response
        try {
            $grade = Grades::findOrFail($id);
            $grade->delete();
            return redirect()->route('grades.index')->with('success', 'Grade deleted successfully.');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Failed to delete grade: ' . $e);
        }
    }
}
