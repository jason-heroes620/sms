<?php

namespace App\Http\Controllers;

use App\Models\Tenant\Fees;
use App\Models\Tenant\PackageFees;
use App\Models\Tenant\Packages;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/FeesAndCharges/Packages');
    }

    public function showAll(Request $request)
    {
        $query = Packages::select('package_id', 'package_name', 'package_description', 'package_price', 'effective_start_date', 'effective_end_date', 'package_status', 'recurring', 'frequency');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('package_name', 'like', '%' . $search . '%');
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
            $query->orderBy('package_price', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $packages = $query->paginate($perPage);
        return response()->json([
            'data' => $packages->items(),
            'meta' => [
                'current_page' => $packages->currentPage(),
                'last_page' => $packages->lastPage(),
                'per_page' => $packages->perPage(),
                'total' => $packages->total(),
                'from' => $packages->firstItem(),
                'to' => $packages->lastItem(),
            ],
        ]);
    }

    public function create()
    {
        $fees = Fees::select('fee_id', 'fee_label', 'uom', 'amount')
            ->where('fee_status', 'active')
            ->get();

        return Inertia::render('Settings/FeesAndCharges/AddPackage', compact('fees'));
    }

    public function store(Request $request)
    {
        $user = Auth::id();

        try {
            $validator = Validator::make($request->all(), [
                'package_name' => 'required|string|max:100|unique:packages,package_name',
                'effective_start_date' => 'required|date',
                'fees' => 'required|array|min:1'
            ]);

            if ($validator->fails()) {
                return redirect()
                    ->back()
                    ->withErrors($validator)
                    ->withInput();
            }
            Log::info($request->input('recurring'));
            $package = Packages::create([
                'package_name' => $request->input('package_name'),
                'package_description' => $request->input('package_description'),
                'package_price' => array_sum(array_column($request->input('fees'), 'amount')),
                'effective_start_date' => $request->input('effective_start_date'),
                'recurring' => $request->input('recurring'),
                'frequency' => $request->input('frequency'),
                'created_by' => $user,
            ]);

            foreach ($request->input('fees') as $fee) {
                PackageFees::create([
                    'package_id' => $package->package_id,
                    'fee_id' => $fee['fee_id']
                ]);
            }

            return redirect()->back()->with('success', 'New Package added.');
        } catch (Exception $e) {
            Log::error('Error adding new package');
            Log::error($e);

            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
