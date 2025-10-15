<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Integrations extends Model
{
    use HasUuids;

    protected $table = 'integrations';
    protected $primaryKey = 'integration_id';
    protected $fillable = [
        'integration',
        'api_link',
        'client_id',
        'client_secret',
        'token',
        'subdomain',
        'integration_status',
    ];

    public $timestamps = false;
}
