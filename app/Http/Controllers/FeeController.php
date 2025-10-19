<?php

namespace App\Http\Controllers;

use App\Models\Tenant\Fees;
use App\Models\Tenant\IntegrationConfigurations;
use App\Models\Tenant\Taxes;
use App\Services\BukkuService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class FeeController extends Controller
{
    protected $uom, $fee_type;
    public $bukkuService;

    public function __construct(SettingUOMController $uom, BukkuService $bukkuService)
    {
        $this->uom = $uom;
        $this->bukkuService = $bukkuService;
        $this->fee_type = [
            [
                'value' => 'one_time',
                'label' => 'One Time'
            ],
            ['value' => 'monthly', 'label' => 'Montly'],
            // [
            //     'value' => 'semester',
            //     'label' => 'Semester'
            // ],
            [
                'value' => 'annual',
                'label' => 'Annual'
            ],
        ];
    }

    public function index()
    {
        $fee_type = $this->fee_type;
        return Inertia::render('Settings/FeesAndCharges/Fees', compact('fee_type'));
    }

    public function showAll(Request $request)
    {
        $query = Fees::select(['fee_id', 'fee_code', 'fee_label', 'uom', 'amount', 'fee_status', 'fee_type', 'tax_id', 'tax_code', 'tax_rate']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('fee_label', 'like', '%' . $search . '%');
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
            $query->orderBy('fees.created_at', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $fees = $query->paginate($perPage);

        // foreach ($fees->items() as &$fee) {
        //     $tax = Taxes::where('tax_id', $fee['tax_id'])->first();
        //     $fee['tax_rate'] = $tax ? $tax['tax_rate'] : null;
        // }
        // unset($fee);

        return response()->json([
            'data' => $fees->items(),
            'meta' => [
                'current_page' => $fees->currentPage(),
                'last_page' => $fees->lastPage(),
                'per_page' => $fees->perPage(),
                'total' => $fees->total(),
                'from' => $fees->firstItem(),
                'to' => $fees->lastItem(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'fee_label' => 'required|string|max:100|unique:fees,fee_label',
                'fee_code' => 'required|string|max:20|unique:fees,fee_code',
                'fee_type' => 'required|string',
                'uom' => 'required|string|max:50',
                'amount' => 'required|numeric|min:0',
                'classification_code' => 'required|string'
            ]);

            Fees::create([
                'fee_label' => $request->fee_label,
                'fee_code' => $request->fee_code,
                'fee_type' => $request->fee_type,
                'uom' => $request->uom,
                'amount' => $request->amount,
                'tax_id' => $request->tax_id,
                'tax_rate' => $request->tax_rate,
                'tax_code' => $request->tax_code,
                'classification_code' => $request->classification_code,
            ]);

            // create product in bukku
            $data = $this->convertBukkuData($request);
            $this->bukkuService->createProduct($request->fee_code, $request->fee_label, $request->amount, $request->uom);

            return redirect()->back()->with('success', 'Fee / Charges created successfully.');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Failed to add Fee / Charges: ' . $e);
        }
    }

    public function edit($id)
    {
        $fee = Fees::findOrFail($id);

        return response()->json([
            'fee' => $fee,
        ]);
    }

    public function update(Request $request)
    {
        try {
            $request->validate([
                'fee_label' => [
                    'required',
                    'string',
                    'max:100',
                    Rule::unique(Fees::class)->ignore($request->id, 'fee_id')
                ],
                'fee_code' => [
                    'required',
                    'string',
                    'max:20',
                    Rule::unique(Fees::class)->ignore($request->id, 'fee_id')
                ],
                'fee_type' => 'required|string',
                'uom' => 'required|string|max:50',
                'amount' => 'required|numeric|min:0',
                'classification_code' => 'required|string',
            ]);

            $fee = Fees::findOrFail($request->id);
            $fee->update([
                'fee_label' => $request->fee_label,
                'fee_code' => $request->fee_code,
                'fee_type' => $request->fee_type,
                'uom' => $request->uom,
                'amount' => $request->amount,
                'tax_id' => $request->tax_id,
                'tax_rate' => $request->tax_rate,
                'tax_code' => $request->tax_code,
                'classification_code' => $request->classification_code,
            ]);
            Log::info('bukku product');
            $product = $this->convertBukkuData($request);
            // $this->bukkuService->createProduct($pro);

            Log::info($product);

            // get product id, units id,

            return redirect()->back()->with('success', 'Fee updated successfully.');
        } catch (Exceptions $e) {
            return redirect()->back()->with('error', 'Failed to update Fee: ' . $e);
        }
    }

    public function updateStatus(Request $request)
    {
        try {
            $request->validate([
                'fee_status' => 'required|string|max:8',
            ]);

            $fee = Fees::findOrFail($request->id);
            $fee->update([
                'fee_status' => $request->fee_status
            ]);

            return response()->json(['success', 'Fee / Charges updated successfully.']);
        } catch (Exceptions $e) {
            return response()->json(['error', 'Failed to update Fee / Charges: ' . $e]);
        }
    }

    public function getFeesProperties()
    {
        $uom = $this->uom->getAllUOM();
        // $taxes = Taxes::select("tax_id", 'tax_name', 'tax_rate')
        //     ->where('tax_status', 'active')->get();
        $lists = ['tax_codes', 'classification_code_list'];

        $list = json_decode($this->bukkuService->configurationList($lists), true);
        $taxes = array_values(array_filter($list['tax_codes']['items'], function ($codes) {
            return $codes['tax_system'] == 'mysst_service_tax' && $codes['is_archived'] == false && $codes['type'] == 'sales_payment';
        }));

        $classification_codes = array_values(array_filter($list['classification_code_list']['items']));

        $fee_type = $this->fee_type;
        return response()->json(compact('uom', 'taxes', 'fee_type', 'classification_codes'));
    }

    private function convertBukkuData($request)
    {
        $account = IntegrationConfigurations::select('configuration_value')->where('configuration_name', 'income_account')->first();

        return [
            'name' => $request->fee_label,
            'classification_code' => $request->classification_code,
            'is_selling' => true,
            'sale_description' => $request->uom,
            'sale_account_id' => $account->configuration_value,
            'sale_tax_code_id' => $request->tax_id,
            'track_inventory' => false,
            'is_buying' => false,
            'units' => [
                [
                    'label' => $request->uom,
                    'rate' => 1,
                    'sale_price' => $request->amount,
                    'is_base' => true,
                ]
            ],
        ];
    }
}
