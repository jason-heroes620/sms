<?php

namespace App\Http\Controllers;

use App\Models\Tenant\SettingRelationship;
use Illuminate\Http\Request;

class SettingRelationshipController extends Controller
{
    public function getRelationships()
    {
        $relationships = SettingRelationship::select(['relationship_label', 'relationship_value'])
            ->where('relationship_status', 'active')
            ->orderBy('sort_order', 'asc')
            ->get();
        return $relationships;
    }
}
