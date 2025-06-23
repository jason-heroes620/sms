<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicYearController extends Controller
{
    public function index(Request $request)
    {
        $query = AcademicYear::select(['academic_year_id as id', 'academic_year', 'start_date', 'end_date', 'is_current']);
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('academic_year', 'like', '%' . $search . '%');
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
            $query->orderBy('end_date', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $academicYears = $query->paginate($perPage);
        // dd($academicYears->items());
        // Return the paginated results to the Inertia view
        return response()->json([
            'data' => $academicYears->items(),
            'meta' => [
                'current_page' => $academicYears->currentPage(),
                'last_page' => $academicYears->lastPage(),
                'per_page' => $academicYears->perPage(),
                'total' => $academicYears->total(),
                'from' => $academicYears->firstItem(),
                'to' => $academicYears->lastItem(),
            ],
        ]);
    }
    public function create()
    {
        return inertia::render('Settings/AcademicYear/AcademicYears');
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        // Logic to store the academic year in the database

        return redirect()->route('academic-year')->with('success', 'Academic Year created successfully.');
    }
    public function edit($id)
    {
        // Logic to retrieve the academic year by ID

        return inertia('Settings/AcademicYear/EditAcademicYear', [
            'academicYear' => [
                'id' => $id,
                // Other fields to be passed to the view
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        // Logic to update the academic year in the database

        return redirect()->route('academic-year')->with('success', 'Academic Year updated successfully.');
    }
}
