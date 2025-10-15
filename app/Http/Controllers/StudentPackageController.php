<?php

namespace App\Http\Controllers;

use App\Models\Tenant\Packages;
use App\Models\Tenant\StudentPackage;
use Illuminate\Http\Request;

class StudentPackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $packages = Packages::select('package_id', 'package_name', 'package_price', 'frequency')
            ->where('package_status', 'active')->get();



        return response()->json(compact('packages'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $query = StudentPackage::select('student_package_id', 'student_packages.package_id', 'package_name', 'package_price', 'frequency', 'student_packages.status')
            ->leftjoin('packages', 'packages.package_id', 'student_packages.package_id')
            ->where('student_id', $request->id);

        if ($request->has('sort')) {
            $query->orderBy($request->sort['field'], $request->sort['direction']);
        } else {
            $query->orderBy('student_packages.created_at', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $students = $query->paginate($perPage);

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

        return response()->json(compact('student_packages'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            StudentPackage::create([
                'student_id' => $request->student_id,
                'package_id' => $request->package_id,
                'start_date' => now(),
            ]);
            return response()->json(['message' => 'Student Package Created Successfully']);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentPackage $studentPackage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudentPackage $studentPackage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $package = StudentPackage::where('student_package_id', $request->id)->first();
        $package->update([
            'status' => 'inactive'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentPackage $studentPackage)
    {
        //
    }
}
