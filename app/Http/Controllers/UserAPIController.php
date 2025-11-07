<?php

namespace App\Http\Controllers;

use App\Services\JibbleService;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request as Psr7Request;
use Illuminate\Http\Request;

class UserAPIController extends Controller
{
    protected $payrollService, $jibbleService;

    public function __construct(JibbleService $jibbleService)
    {
        $this->jibbleService = $jibbleService;
    }

    public function leaves($id)
    {

        $leaves = $this->jibbleService->getLeaves($id);

        return response()->json([
            'message' => 'Leaves fetched successfully'
        ]);
    }
    public function applyLeave(Request $request)
    {
        return response()->json([
            'message' => 'Leave applied successfully'
        ]);
    }
}
