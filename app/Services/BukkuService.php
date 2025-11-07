<?php

namespace App\Services;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use App\Models\Tenant\Integrations;
use Illuminate\Support\Facades\Log;

class BukkuService
{
    public $api_link, $token, $subdomain, $integration_status;

    public function __construct()
    {
        $integrations = Integrations::where('integration', 'bukku')->first();
        $this->api_link = $integrations->api_link;
        $this->token = $integrations->token;
        $this->subdomain = $integrations->subdomain;
        $this->integration_status = $integrations->status;
    }

    public function configurationList($config = null)
    {
        $lists = $config ?? ['accounts', 'tax_codes', 'terms'];
        try {
            $client = new Client();
            $response = $client->request('POST', $this->api_link . '/v2/lists', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->token,
                    'Content-Type' => 'application/json',
                    'Company-Subdomain' => $this->subdomain
                ],
                'body' => json_encode([
                    'lists' => $lists
                ])
            ]);

            Log::info('Bukku Service');

            return $response->getBody()->getContents();
        } catch (Exception $e) {
            Log::error('Bukku Service Error');
            Log::error($e);
            Log::error($e->getMessage());
        }
    }

    public function createProduct($data)
    {
        if ($this->integration_status === 'enabled') {
            try {
                $client = new Client();
                $response = $client->request('POST', $this->api_link . '/products', [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $this->token,
                        'Content-Type' => 'application/json',
                        'Company-Subdomain' => $this->subdomain
                    ],
                    'json' => $data
                ]);
                return $response;
            } catch (Exception $e) {
                Log::error($e->getMessage());
            }
        }
    }

    public function createInvoice($data)
    {
        Log::info('Bukku Service');
        Log::info($data);
        if ($this->integration_status === 'enabled') {
            try {
                $client = new Client();
                $response = $client->request('POST', $this->api_link . '/sales/invoices', [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $this->token,
                        'Content-Type' => 'application/json',
                        'Company-Subdomain' => $this->subdomain,
                        'Accept' => 'application/json'
                    ],
                    'json' => $data
                ]);

                return $response->getBody()->getContents();
            } catch (Exception $e) {
                Log::error($e->getMessage());
            }
        }
    }
}
