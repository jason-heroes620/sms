<?php

namespace App\Http\Controllers;

use App\Models\Tenant\Integrations;
use App\Services\BukkuService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class IntegrationController extends Controller
{
    public $bukkuService;

    public function __construct(BukkuService $bukkuService)
    {
        $this->bukkuService = $bukkuService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payroll = Integrations::where('integration', 'payroll_panda')->first();
        $jibble = Integrations::where('integration', 'jibble')->first();
        $bukku = Integrations::where('integration', 'bukku')->first();

        $configs = json_decode($this->bukkuService->configurationList(), true);

        try {
            $accounts = array_values(array_filter($configs['accounts']['items'], function ($account) {
                return $account['type'] == 'income' && $account['is_archived'] == false;
            }));

            $tax_codes = array_values(array_filter($configs['tax_codes']['items'], function ($codes) {
                return $codes['tax_system'] == 'mysst_service_tax' && $codes['is_archived'] == false && $codes['type'] == 'sales_payment';
            }));

            $terms = array_values(array_filter($configs['terms']['items'], function ($term) {
                return $term['is_archived'] == false;
            }));

            $account_receivables = array_values(array_filter($configs['accounts']['items'], function ($account) {
                return $account['system_type'] == 'accounts_receivable' && $account['is_archived'] == false;
            }));

            return Inertia::render('Settings/Integrations/Integrations', compact('payroll', 'jibble', 'bukku', 'accounts', 'tax_codes', 'terms', 'account_receivables'));
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return Inertia::render('Settings/Integrations/Integrations', compact('payroll', 'jibble', 'bukku'))->with('error', 'Unable to load accounts and tax codes');
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {}

    /**
     * Display the specified resource.
     */
    public function show(Integrations $integrations)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Integrations $integrations)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        if ($request->integration == 'bukku') {
            $validator = Validator::make($request->all(), [
                'token' => 'required',
                'subdomain' => 'required',
            ]);
        } else {
            $validator = Validator::make($request->all(), [
                'client_id' => 'required',
                'client_secret' => 'required',
            ]);
        }
        if ($validator->fails()) {
            return redirect()->back()->with('error', 'Please fill in all required fields.');
        }

        try {
            if ($request->integration == 'bukku') {
                $integrations = Integrations::where('integration', $request->integration)->update(
                    [
                        'token' => $request->token,
                        'subdomain' => $request->subdomain,
                        'integration_status' => $request->integration_status,
                    ]
                );
            } else {
                $integrations = Integrations::where('integration', $request->config)->update(
                    ['integration' => $request->config],
                    [
                        'client_secret' => $request->client_secret,
                        'client_id' => $request->client_id,
                        'integration_status' => $request->integration_status,
                    ]
                );
            }

            return redirect()->back()->with('success', 'Integration created successfully.');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->with('error', 'Unable to create integration.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Integrations $integrations)
    {
        //
    }

    public function updateIntegrationConfigurations(Request $request)
    {
        Integrations::update(
            [$request->config],
            [
                'integration_status' => $request->integration_status,
            ]
        );
    }
}
