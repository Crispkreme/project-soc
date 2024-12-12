<?php

namespace App\Repositories;

use App\Contracts\DataAnalyticContract;
use App\Models\DataAnalytic;
use Illuminate\Support\Facades\DB;

class DataAnalyticRepository implements DataAnalyticContract
{

    protected $model;

    public function __construct(DataAnalytic $model)
    {
        $this->model = $model;
    }

    public function updateOrCreateDataAnalytic($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'illness' => $data['illness'],
                'medicine_id' => $data['medicine_id'],
                'quantity' => $data['quantity'],
            ]
        );
    }

    public function getAllDataAnalyticByMonth()
    {
        $dataAnalytics = DB::table('data_analytics')
            ->join('medicines', 'data_analytics.medicine_id', '=', 'medicines.id')
            ->select([
                'data_analytics.illness',
                'medicines.medicine_name as medicine',
                DB::raw('SUM(data_analytics.quantity) as total_quantity'),
                DB::raw('DATE_FORMAT(data_analytics.created_at, "%M %Y") as month'),
            ])
            ->groupBy('month', 'data_analytics.illness', 'medicines.medicine_name')
            ->orderBy('month')
            ->get();

        $groupedByMonth = $dataAnalytics->groupBy('month')->map(function ($items) {
            return $items->map(function ($item) {
                return [
                    'illness' => $item->illness,
                    'medicine' => $item->medicine,
                    'total_quantity' => $item->total_quantity,
                ];
            });
        });

        return $groupedByMonth;
    }
}
