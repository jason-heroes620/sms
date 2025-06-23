<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasUlids;

    protected $primaryKey = 'academic_year_id';
    protected $table = 'academic_years';

    protected $fillable = [
        'academic_year',
        'start_date',
        'end_date',
        'is_current',
    ];

    public function classes()
    {
        return $this->hasMany(Classes::class);
    }
}
