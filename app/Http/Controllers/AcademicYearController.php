<?php

namespace App\Http\Controllers;

use App\Models\Tenant\AcademicYear;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AcademicYearController extends Controller
{
    public function index(Request $request)
    {
        $query = AcademicYear::select(['academic_year_id', 'academic_year', 'start_date', 'end_date', 'is_current']);
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


        $perPage = $request->per_page ?? 2;
        $academicYears = $query->paginate($perPage);

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
        $academic_years = AcademicYear::all();

        return Inertia::render('Settings/AcademicYears/AcademicYears', compact('academic_years'));
    }

    public function store(Request $request)
    {
        $user = Auth::id();
        try {
            $validator = Validator::make($request->all(), [
                'academic_year' => 'required|string|max:50|unique:academic_years,academic_year',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
            ]);

            if ($validator->fails()) {
                return redirect()
                    ->back()
                    ->withErrors($validator)
                    ->withInput();
            }
            $year = AcademicYear::create([
                'academic_year' => $request->input('academic_year'),
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
                'is_current' => $request->input('is_current') == true ? 'true' : 'false',
                'created_by' => $user
            ]);

            if ($request->input('is_current') == 'true') {
                AcademicYear::setCurrent($year->id);
            }

            return redirect()->back()->with('success', 'Academic year created successfully.');
        } catch (Exception $e) {
            Log::error('Error saving academic year');
            Log::error($request->all());
            Log::error($e);

            return redirect()->back()->with('error', 'Error saving.');
        }
    }

    public function edit($id)
    {
        // Logic to retrieve the academic year by ID

        return inertia('Settings/AcademicYears/EditAcademicYear', [
            'academicYear' => [
                'id' => $id,
                // Other fields to be passed to the view
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'academic_year' => 'required|string|max:50',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        // Logic to update the academic year in the database

        return redirect()->route('academic-year')->with('success', 'Academic Year updated successfully.');
    }

    public function updateIsCurrent(Request $request)
    {
        try {
            $year = AcademicYear::setCurrent($request->id);

            return response()->json(['success' => 'Update Successful. Current academic year set to ' . $year->academic_year], 200);
        } catch (Exception $e) {
            Log::error('Error updating ' . $request->id . ' to current');
            Log::error($e);
            return response()->json(['error' => 'Error setting the selected academic year to current'], 400);
        }
    }
}
