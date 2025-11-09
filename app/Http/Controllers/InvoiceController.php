<?php

namespace App\Http\Controllers;

use App\Models\Tenant\Branches;
use App\Models\Tenant\Invoices;
use App\Models\Tenant\PackageFees;
use App\Models\Tenant\StudentPackage;
use App\Models\Tenant\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    protected $branchUser, $branches;

    public function __construct(UserController $branchUser)
    {
        $user = Auth::id();
        $this->branchUser = $branchUser;
    }

    public function index()
    {
        $user = Auth::getUser()->id;

        $branches = Branches::select(['branch_id as id', 'branch_name as value'])
            ->where('branch_status', 'active')
            ->whereIn('branch_id', $this->branchUser->getUserBranchIds($user))
            ->get();
        return Inertia::render('Billing/Invoices/Invoices', compact('branches'));
    }

    public function showAll(Request $request)
    {
        $query = Invoices::select(['invoice_id', 'invoice_no', 'invoice_date', 'due_date', 'invoice_amount', 'invoice_status', 'class_name', DB::raw('CONCAT(students.first_name, " ", students.last_name) as student_name')])
            ->leftJoin('students', 'students.student_id', 'invoices.student_id')
            ->leftJoin('class_student', 'class_student.student_id', 'students.student_id')
            ->leftJoin('classes', 'classes.class_id', 'class_student.class_id')
            ->leftJoin('branch_class', 'branch_class.branch_id', 'classes.class_id');

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
            $query->orderBy('invoices.invoice_date', 'desc', 'invoices.invoice_no', 'desc');
        }

        $perPage = $request->per_page ?? 10;
        $invoices = $query->paginate($perPage);
        return response()->json([
            'data' => $invoices->items(),
            'meta' => [
                'current_page' => $invoices->currentPage(),
                'last_page' => $invoices->lastPage(),
                'per_page' => $invoices->perPage(),
                'total' => $invoices->total(),
                'from' => $invoices->firstItem(),
                'to' => $invoices->lastItem(),
            ],
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $students = Students::select('student_id')
            ->where('student_status', 'active')->get();

        return Inertia::render('Billing/Invoices/CreateInvoice', compact('students'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoices $invoices)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $invoice = Invoices::select(['invoice_id', 'invoice_no', 'invoice_date', 'due_date', 'invoice_amount', 'invoice_status',  DB::raw('CONCAT(students.first_name, " ", students.last_name) as student_name'), 'invoices.student_id'])
            ->leftJoin('students', 'students.student_id', 'invoices.student_id')
            ->where('invoice_id', $id)
            ->first();
        Log::info($invoice);
        $package = StudentPackage::select('package_name', 'package_price', 'student_packages.package_id')
            ->leftJoin('packages', 'packages.package_id', 'student_packages.package_id')
            ->where('student_id', $invoice->student_id)->first();
        Log::info($package);
        $fees = PackageFees::leftJoin('fees', 'fees.fee_id', 'package_fees.fee_id')
            ->where('package_id', $package->package_id)->get();
        $invoice['package'] = $package;
        $invoice['fees'] = $fees;

        return Inertia::render('Billing/Invoices/Invoice', compact('invoice'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoices $invoices)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoices $invoices)
    {
        //
    }
}
