<?php

namespace App\Http\Controllers;

use App\Jobs\CreatePayrollPosition;
use App\Models\Tenant\Positions;
use App\Services\PayrollService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PositionController extends Controller
{
    protected $payrollService;

    public function __construct(PayrollService $payrollService)
    {
        $this->payrollService = $payrollService;
    }

    public function index()
    {
        return Inertia::render('Settings/User/Positions');
    }

    public function showAll(Request $request)
    {
        $query = Positions::select('position');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('position', 'like', '%' . $search . '%');
        }

        if ($request->has('filters')) {
            foreach ($request->filters as $column => $value) {
                if ($value !== null) {
                    $query->where('position_status', $value);
                }
            }
        }

        if ($request->has('sort')) {
            $query->orderBy($request->sort['field'], $request->sort['direction']);
        } else {
            $query->orderBy('position', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $positions = $query->paginate($perPage);

        return response()->json([
            'data' => $positions->items(),
            'meta' => [
                'current_page' => $positions->currentPage(),
                'last_page' => $positions->lastPage(),
                'per_page' => $positions->perPage(),
                'total' => $positions->total(),
                'from' => $positions->firstItem(),
                'to' => $positions->lastItem(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'position' => 'required|unique:positions,position',
        ]);
        Log::info('Validator');
        Log::error($validator->errors());
        if ($validator->fails()) {
            Log::error($validator->errors());
            return redirect()
                ->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            Log::info('Creating Position');
            Log::info('Position: ' . $request->position);
            DB::beginTransaction();

            $position = Positions::create([
                'position' => $request->position,
            ]);

            $response = $this->payrollService->createPositions($position);

            if ($response->getStatusCode() == 201 || $response->getStatusCode() == 200) {
                Log::info('response successful');
                $data = json_decode($response->getBody()->getContents(), true);
                $position->update([
                    'payroll_position_id' => $data['id'], // Store the API's ID
                ]);
                DB::commit();
            } else {
                // Log the error for monitoring
                Log::warning("API failed for position {$position->postion_id}. Status: {$response->status()}");
            }

            return redirect()->back()->with(
                'success',
                'Position created successfully'
            );
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error creating position');
            Log::error($e);
            return redirect()->back()->with(
                'error',
                $e->getMessage()
            );
        }
    }
}
