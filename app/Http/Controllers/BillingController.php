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
        try {
            $user = Auth::id();

            $billing = Billings::create([
                'billing_month' => $request->billing_month,
                'billing_year' => $request->billing_year,
                'billing_type' => $request->billing_type,
                'created_by' => $user,
            ]);

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
                Log::info('invoice');
                Log::info($invoice['transaction']);

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
        } catch (\Throwable $th) {
            Log::info($th);
            return redirect()->back()->with('error', 'Billing failed');
        }
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
