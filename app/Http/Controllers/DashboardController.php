<?php

namespace App\Http\Controllers;

use App\Models\Tenant\Invoices;
use App\Models\Tenant\Students;
use App\Models\Tenant\User;
use App\Models\Tenant\UserProfiles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{

    public function index()
    {
        $students = Students::where('student_status', 'active')->count();
        $teachers = UserProfiles::leftJoin('positions', 'user_profiles.position_id', 'positions.position_id')
            ->where('user_status', 'active')
            ->where('position', 'like', '%teacher%')
            ->count();

        $months = $this->getSixMonths();

        $unpaidInvoices = Invoices::select(DB::raw('sum(invoice_amount-paid) as total'), DB::raw('DATE_FORMAT(invoice_date, "%b") as month'), 'invoice_status as label')
            ->whereIn('invoice_status', ['unpaid'])
            ->whereMonth('invoice_date', '<=', date('m'))
            ->whereMonth('invoice_date', '>=', date('m', strtotime("-6 month")))
            ->groupBy('month', 'invoice_status')
            ->get();

        $partialInvoices = Invoices::select(DB::raw('sum(paid) as total'), DB::raw('DATE_FORMAT(invoice_date, "%b") as month'), 'invoice_status as label')
            ->whereIn('invoice_status', ['partial'])
            ->whereMonth('invoice_date', '<=', date('m'))
            ->whereMonth('invoice_date', '>=', date('m', strtotime("-6 month")))
            ->groupBy('month', 'invoice_status')
            ->get();


        $paidInvoices = Invoices::select(DB::raw('sum(paid) as total'),  DB::raw('DATE_FORMAT(invoice_date, "%b") as month'), 'invoice_status as label')
            ->whereIn('invoice_status', ['paid'])
            ->whereMonth('invoice_date', '<=', date('m'))
            ->whereMonth('invoice_date', '>=', date('m', strtotime("-6 month")))
            ->groupBy('month', 'invoice_status')
            ->get();

        $income = Invoices::select(DB::raw('sum(paid) as total'),  DB::raw('DATE_FORMAT(invoice_date, "%b") as month'))
            ->whereIn('invoice_status', ['partial', 'paid'])
            ->whereMonth('invoice_date', '<=', date('m'))
            ->whereMonth('invoice_date', '>=', date('m', strtotime("-6 month")))
            ->groupBy('month')
            ->get();

        $days_ahead = 60;

        $teacherBirthdays = UserProfiles::select(DB::raw("concat(first_name, ' ', last_name) as name"), 'dob')
            ->whereRaw("
        DATE_FORMAT(dob, '%m-%d')
        BETWEEN 
            DATE_FORMAT(CURDATE(), '%m-%d')
        AND 
            DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL ? DAY), '%m-%d')
    ", [$days_ahead])
            ->orderByRaw("DATE_FORMAT(dob, '%m-%d') ASC")
            ->get();

        $studentBirthdays = Students::select(DB::raw("concat(first_name, ' ', last_name) as name"), 'dob')
            ->where('student_status', 'active')
            ->whereMonth('dob', '=>', date('m'))
            ->whereDay('dob', '>=', date('d'))
            ->get();
        $birthdays = array_merge($teacherBirthdays->toArray(), $studentBirthdays->toArray());

        Log::info('birthday');
        Log::info($teacherBirthdays);

        return Inertia::render('Dashboard', compact('students', 'teachers', 'unpaidInvoices', 'paidInvoices', 'partialInvoices', 'income', 'birthdays'));
    }

    private function getSixMonths()
    {
        $sixMonths = [];
        for ($i = 0; $i < 6; $i++) {
            $sixMonths[] = date('m', strtotime("-$i month"));
        }

        // return implode(',', $sixMonths);
        return $sixMonths;
    }
}
