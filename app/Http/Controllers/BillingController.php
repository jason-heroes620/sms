<?php

namespace App\Http\Controllers;

use App\Models\Tenant\BillingItems;
use App\Models\Tenant\Billings;
use App\Models\Tenant\Fees;
use App\Models\Tenant\IntegrationConfigurations;
use App\Models\Tenant\Invoices;
use App\Models\Tenant\PackageFees;
use App\Models\Tenant\Packages;
use App\Models\Tenant\StudentPackage;
use App\Models\Tenant\Students;
use App\Services\BukkuService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BillingController extends Controller
{
    public $bukkuService;

    public function __construct(SettingUOMController $uom, BukkuService $bukkuService)
    {
        $this->bukkuService = $bukkuService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Billing/Billings/Billings');
    }

    public function showAll(Request $request)
    {
        $query = Billings::select('billing_id', 'billing_month', 'billing_year', 'created_by', 'billing_status', 'billings.created_at', 'first_name', 'last_name')
            ->leftJoin('user_profiles', 'user_profiles.user_id', 'billings.created_by');

        // if ($request->has('search')) {
        //     $search = $request->input('search');
        //     $query->where('fee_label', 'like', '%' . $search . '%');
        // }

        // if ($request->has('filters')) {
        //     foreach ($request->filters as $column => $value) {
        //         if ($value !== null) {
        //             $query->where($column, $value);
        //         }
        //     }
        // }

        if ($request->has('sort')) {
            $query->orderBy($request->sort['field'], $request->sort['direction']);
        } else {
            $query->orderBy('billings.created_at', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $billings = $query->paginate($perPage);

        return response()->json([
            'data' => $billings->items(),
            'meta' => [
                'current_page' => $billings->currentPage(),
                'last_page' => $billings->lastPage(),
                'per_page' => $billings->perPage(),
                'total' => $billings->total(),
                'from' => $billings->firstItem(),
                'to' => $billings->lastItem(),
            ],
        ]);
    }

    public function create() {}

    public function generate(Request $request)
    {
        foreach ($request->students as $studentId) {
            $student = Students::findOrFail($studentId);
            $package = Packages::leftJoin('package_fees', 'package_fees.package_id', 'packages.package_id')
                ->where('package_id', $student->package_id);

            $billing = Billings::create([
                'student_id' => $studentId,
                'package_id' => $package->package_id,
                'billing_month' => $request->billing_month,
                'billing_year' => $request->billing_year,
            ]);

            foreach ($package->data['fee_id'] as $item) {
                $fees = Fees::leftJoin('taxes', 'taxes.tax_id', 'taxes.tax_id')
                    ->where('fee_id', $item['fee_id'])->first();

                $tax = $fees['tax_rate'] * $item['amount'] / 100;
                BillingItems::create([
                    'billing_id' => $billing->id,
                    'fee_id' => $item['fee_type_id'],
                    'tax_amount' => $tax,
                    'fee_amount' => $fees['fee_amount'],
                    'amount' => $fees['amount'] + $tax,
                ]);
            }
        }

        // Generate invoice
        // (new GenerateInvoiceAction())->execute($billing);

        // Notify parent
        // $this->notifyParent($billing);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::id();
        // Billings::create([
        //     'billing_month' => $request->billing_month,
        //     'billing_year' => $request->billing_year,
        //     'created_by' => $user,
        // ]);

        // add task to generate invoice
        $packages = StudentPackage::select('students.student_id', 'student_packages.package_id', 'packages.package_name')
            ->leftJoin('students', 'students.student_id', 'student_packages.student_id')
            ->leftJoin('packages', 'packages.package_id', 'student_packages.package_id')
            ->where('students.student_status', 'active')
            ->where('student_packages.status', 'active')
            ->where('packages.frequency', $request->billing_type)
            ->get();

        foreach ($packages as $package) {
            $package['fees'] = PackageFees::leftJoin('fees', 'package_fees.fee_id', 'fees.fee_id')
                ->where('package_id', $package->package_id)
                ->get();

            $data = $this->convertToInvoice($package);
            $invoice = json_decode($this->bukkuService->createInvoice($data), true);
            // $invoice = '{"transaction":{"id":2985,"payment_mode":"credit","contact_id":237,"billing_contact_person_id":null,"billing_contact_person":null,"shipping_contact_person_id":null,"shipping_contact_person":null,"contact_name":"1Playground Group","group_id":null,"group_name":null,"billing_party":null,"title":"Half Day (for 3 year old class)","show_shipping":false,"shipping_info":null,"shipping_party":null,"number":"IV-12550","number2":null,"date":"2025-10-12","currency_code":"MYR","currency_symbol":"RM","exchange_rate":1,"tag_ids":[],"tag_names":[],"tax_mode":"exclusive","form_items":[{"id":2977,"type":null,"key":"25e6f857fb31035f2f3e3bedca2c556e","line":1,"account_id":20,"account_name":"Sales Income","account_code":"5000","description":"Half Day (3 years old)","product_id":297,"product_name":"Half Day (3 years old)","product_sku":null,"product_bin_location":null,"product_unit_id":301,"product_unit_label":"unit","location_id":null,"location_code":null,"quantity":1,"unit_price":450,"amount":450,"discount":null,"discount_amount":0,"tax_code_id":22,"tax_code":"SV8","tax_amount":36,"net_amount":486,"base_quantity":1,"base_product_unit_label":"unit","classification_code":"010","classification_name":"Education fees","service_date":"2025-10-01","transfer_item_id":null,"transfer_transaction":null}],"rounding_on":false,"rounding_amount":0,"linked_items":[],"term_items":[{"id":1597,"key":"872b42ecad97f86e57e2926b96ea079d","term_id":10,"term_name":"30 Days","term":{"id":10,"name":"30 Days"},"date":"2025-11-11","payment_due":"100%","description":"Balance","amount":486,"balance":486}],"fields":[],"remarks":null,"description":null,"internal_note":null,"files":[],"amount":486,"balance":486,"status":"ready","type":"sale_invoice","void_reason":null,"voided_at":null,"short_link":"https:\/\/myinvoisdemo.bukku.fyi\/l\/bmyRv_yCx4","reconciliations":[],"deposit_items":[],"costing_info_items":[],"snapshotted_at":"2025-10-12 23:52:09","customs_form_no":null,"customs_k2_form_no":null,"incoterms":null,"myinvois_action":"VALIDATE","myinvois_document_id":1345,"myinvois_document_uuid":"5KJF7KWNCN9H1EDCQAHYHC7K10","myinvois_document_status":"SUBMITTED","myinvois_document_long_id":"","issued_at":"2025-10-12 23:52:09","validated_at":null,"validation_results":null,"rejected_at":null,"reject_message":null,"rejected_reason":null,"cancelled_at":null,"cancel_message":null,"is_consolidated":false}}';
            Log::info('invoice');
            Log::info($invoice['transaction']);
            // Log::info($invoice['transaction']);
            // $invoice = json_decode($invoice, true);
            $transaction = $invoice['transaction'];
            Invoices::create([
                'invoice_no' => $transaction['number'],
                'invoice_date' => now(),
                'due_date' => now()->addDays(7),
                'student_id' => $package->student_id,
                'invoice_amount' => $transaction['amount'],
            ]);
        }

        Log::info($packages);

        return redirect()->back()->with('success', 'Billing created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Billings $billings)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Billings $billings)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Billings $billings)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Billings $billings)
    {
        //
    }

    private function notifyParent($billing)
    {
        // $student = Students::findOrFail($billing->student_id);
        // $parent = Parents::findOrFail($student->parent_id);
        // $parent->notify(new InvoiceGenerated($billing));
    }

    private function convertToInvoice($package)
    {
        $form_items = [];
        foreach ($package->fees as $p) {
            $form_items[] = [
                'type' => null,
                'account_id' => $this->getConfigValue('income_account'),
                'description' => $p->fee_label,
                'service_date' => date('Y-m-01'),
                'product_id' => 297,
                'product_unit_id' => '', // if unit leave blank, else get id when product is created
                'unit_price' => $p->amount,
                'tax_code_id' => $p->tax_id,
                'classification_code' => $p->classification_code,
                'quantity' => 1,
            ];
        }
        Log::info('form_items');
        Log::info($form_items);
        $term_items = [
            'term_id' => $this->getConfigValue('term'),
            'date' => date('Y-m-d'),
            'payment_due' => '100%',
            'description' => 'Balance'
        ];

        return [
            'payment_mode' => 'credit',
            'contact_id' => 237, // need to create contact in Bukku
            'number' => '', // invoice no, default or custom
            'date' => date('Y-m-d'),
            'currency_code' => 'MYR',
            'exchange_rate' => 1,
            'tax_mode' => 'exclusive',
            'title' => $package->package_name,
            'form_items' => $form_items,
            'term_items' => [$term_items],
            'status' => 'ready',
            'myinvois_action' => 'VALIDATE'
        ];
    }

    private function getConfigValue($key)
    {
        $config = IntegrationConfigurations::where('configuration_name', $key)->first();
        return $config->configuration_value;
    }
}
