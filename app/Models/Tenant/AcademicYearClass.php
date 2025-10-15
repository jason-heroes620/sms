<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\Pivot;

class AcademicYearClass extends Pivot
{
    use HasUuids;

    protected $table = 'academic_year_class';
    protected $primaryKey = 'academic_year_class_id';
    protected $fillable = [
        'academic_year_id',
        'class_id',
        'capacity'
    ];
    public $timestamps = false;

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function classModel()
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }

    public function scopeWithActiveYear($query)
    {
        return $query->whereHas('academicYears', function ($q) {
            $q->where('is_current', 'true');
        });
    }
}
