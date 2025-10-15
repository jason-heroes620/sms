<?php

namespace App\Http\Controllers;

use App\Models\Tenant\Branches;
use App\Services\JibbleService;
use App\Services\PayrollService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BranchController extends Controller
{
    protected $payrollService, $jibbleService;

    public function __construct(PayrollService $payrollService, JibbleService $jibbleService)
    {
        $this->payrollService = $payrollService;
        $this->jibbleService = $jibbleService;
    }

    public function index()
    {
        return Inertia::render('Settings/SchoolProfile/Branch');
    }

    public function showAll(Request $request)
    {
        $query = Branches::select('branch_id', 'branch_name', 'branch_status');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('branch_name', 'like', '%' . $search . '%');
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
            $query->orderBy('branch_status');
            $query->orderBy('branch_name', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $branches = $query->paginate($perPage);
        return response()->json([
            'data' => $branches->items(),
            'meta' => [
                'current_page' => $branches->currentPage(),
                'last_page' => $branches->lastPage(),
                'per_page' => $branches->perPage(),
                'total' => $branches->total(),
                'from' => $branches->firstItem(),
                'to' => $branches->lastItem(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'branch_name' => 'required|string|max:150|unique:branches,branch_name',
        ]);

        try {
            $branch = new Branches();
            $branch->branch_name = $request->branch_name;
            $branch->branch_address = $request->branch_address;
            $branch->branch_contact_no = $request->branch_contact_no;
            $branch->branch_email = $request->branch_email;
            $branch->created_by = $user->id;
            $branch->branch_status = 'active';
            $branch->branch_location = $request->branch_location;
            // $branch->save();

            // Payroll Location Entry
            $payroll = $this->convertPayrollLocation($request);
            $payroll_id = $this->payrollService->createLocation($payroll);

            $branch->payroll_location_id = $payroll_id;

            // Jibble Location Entry
            $jibble = $this->convertJibbleLocation($request);
            $jibble_id = $this->jibbleService->createLocation($jibble);

            $branch->jibble_location_id = $jibble_id;
            $branch->save();

            return redirect()->back()->with('success', 'Branch created successfully.');
        } catch (Exception $e) {
            Log::error('Error creating branch.');
            Log::error($e);
            return redirect()->back()->with('error', 'Error creating branch.');
        }
    }

    public function edit($id)
    {
        $branch = Branches::find($id);
        return response()->json([
            'branch' => $branch,
        ]);
    }

    public function update(Request $request)
    {
        try {
            $branch = Branches::where('branch_id', $request->id)->first();
            Log::info($branch);
            $validator = Validator::make($request->all(), [
                'branch_name' => [
                    'required',
                    'string',
                    'max:150',
                    Rule::unique(Branches::class)->ignore($request->id, 'branch_id'),
                ]
            ]);

            if ($validator->fails()) {
                Log::error("Validator: Failed");
                Log::error($validator->fails());
                return redirect()
                    ->back()
                    ->withErrors($validator)
                    ->withInput();
            }

            $branch->update([
                'branch_name' => $request->branch_name,
                'branch_address' => $request->branch_address,
                'branch_contact_no' => $request->branch_contact_no,
                'branch_email' => $request->branch_email,
                'branch_location' => $request->branch_location,
            ]);

            return redirect()->back()->with('success', 'Branch updated successfully.');
        } catch (Exception $e) {
            Log::error('Error updating branch.');
            Log::error($e);
            return redirect()->back()->with('error', 'Error updating branch.');
        }
    }

    private function convertPayrollLocation($branch)
    {
        $data = [
            'name' => $branch->branch_name,
            'address' => [
                'addressLine1' => $branch->branch_address['address1'],
                'addressLine2' => $branch->branch_address['address2'],
                'addressLine3' => $branch->branch_address['address3'],
                'postcode' => $branch->branch_address['postcode'],
                'state' => $branch->branch_address['state'],
            ],
            'employeeIds' => []
        ];
        Log::info('Payroll Location Data Convert');
        Log::info($data);
        return $data;
    }

    private function convertJibbleLocation($branch)
    {
        $data = [
            'name' => $branch->branch_name,
            'address' => implode(', ', $branch->branch_address),
            'geoFence' => [
                'radius' => 300,
                'units' => 'Meters'
            ],
            'coordinates' => [
                'latitude' => $branch->branch_location['lat'],
                'longitude' => $branch->branch_location['lng']
            ]
        ];

        return $data;
    }
}
