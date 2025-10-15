<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class IntegrationConfigurations extends Model
{
    use HasUuids;

    protected $table = 'integration_configurations';
    protected $primaryKey = 'configuration_id';
    protected $fillable = [
        'configuration_id',
        'configuration_name',
        'configuration_code',
        'configuration_value',
    ];
}
