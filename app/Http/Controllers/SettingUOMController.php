<?php

namespace App\Http\Controllers;

use App\Models\Tenant\SettingUOM;
use Illuminate\Http\Request;

class SettingUOMController extends Controller
{
    public function getAllUOM()
    {
        $uom = SettingUOM::select(['uom_label', 'uom_value'])
            ->where('uom_status', 'active')
            ->orderBy('uom_label')
            ->get();

        return $uom;
    }
}
