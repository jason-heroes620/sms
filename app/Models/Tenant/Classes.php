<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Classes extends Model
{
    use HasUuids;

    protected $table = 'classes';
    protected $primaryKey = 'class_id';
    protected $fillable = [
        'academic_year_id',
        'class_name',
        'class_description',
        'class_status'
    ];

    public function academicYears()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id', 'academic_year_id');
    }

    public function scopeWithActiveAcademicYears($query)
    {
        return $query->whereHas('academicYears', function ($q) {
            $q->where('is_current', 'true');
        });
    }
}
