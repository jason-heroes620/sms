<?php

namespace App\Http\Controllers;

use App\Models\Tenant\IntegrationConfigurations;
use App\Models\Tenant\Integrations;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class IntegrationConfigurationController extends Controller
{
    public $configuration;

    public function __construct()
    {
        $this->configuration = [
            'income_account',
            'service_tax',
            'term',
            'account_receivable'
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = IntegrationConfigurations::select('configuration_name', 'configuration_value as value')
            ->whereIn('configuration_name', $this->configuration)->get();
        Log::info('data' . $data);

        return response()->json([
            'data' => $data,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'income_account' => 'required|string',
            'service_tax' => 'required|string',
            'term' => 'required|string',
            'account_receivable' => 'required|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            foreach ($this->configuration as $config) {
                $value = $request->input($config);
                IntegrationConfigurations::updateOrCreate([
                    'configuration_name' => $config,
                ], [
                    'configuration_value' => $value,
                ]);
            }

            return redirect()->back()->with([
                'message' => 'Integration configuration created successfully',
            ]);
        } catch (Exception $e) {
            return redirect()->back()->with([
                'message' => 'Error creating integration configuration',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(IntegrationConfigurations $integrationConfigurations)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(IntegrationConfigurations $integrationConfigurations)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request) {}
}
