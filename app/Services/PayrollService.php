<?php

namespace App\Services;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use App\Models\Tenant\Integrations;
use App\Models\Tenant\Positions;
use Illuminate\Support\Facades\Log;

class PayrollService
{
    public $api_link, $client_id, $client_secret, $token;

    public function __construct()
    {
        $intergrations = Integrations::where('integration', 'payroll_panda')->first();
        $this->client_id = $intergrations->client_id;
        $this->client_secret = $intergrations->client_secret;
        $this->api_link = $intergrations->api_link;
        $this->token = $intergrations->token;
    }

    public function getToken()
    {
        $client = new Client();
        $options = [
            'form_params' => [
                'client_id' => $this->client_id,
                'client_secret' => $this->client_secret,
                'grant_type' => 'client_credentials',
                'scope' => 'webapi'
            ]
        ];
        $request = new Request('POST', "$this->api_link/connect/token");
        $response = $client->sendAsync($request, $options)->wait();
        $tokenData = json_decode($response->getBody()->getContents(), true);
        return $tokenData['access_token'];
    }

    // Employees
    public function getEmployees()
    {
        $client = new Client();
        try {
            $response = $client->request('GET', $this->api_link . '/Employees?archived=false', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->token,
                    'Content-Type' => 'application/json'
                ],
            ]);

            Log::info('payroll get employees');
            Log::info($response->getBody()->getContents());
            return json_decode($response->getBody()->getContents(), true);
        } catch (Exception $e) {
            if ($e->getCode() === 401) {
                // Token has expired, handle token expiration
                $newToken = $this->handleTokenExpiration($client, 'getEmployees', $this->token);
                return $newToken;
            } else {
                // Handle other exceptions
                throw $e;
            }
        }
    }

    public function createEmployee($data)
    {
        $client = new Client();
        try {
            $response = $client->request('POST', $this->api_link . '/Employees', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->token,
                    'Content-Type' => 'application/json'
                ],
                'json' => $data
            ]);
            return $response;
        } catch (Exception $e) {
            if ($e->getCode() === 401) {
                // Token has expired, handle token expiration
                $newToken = $this->handleTokenExpiration($client, 'createEmployee', $this->token, $data);
                return $newToken;
            } else {
                // Handle other exceptions
                throw $e;
            }
        }
    }

    // End Employees


    // Locations

    public function getLocations()
    {
        $client = new Client();
        try {
            $response = $client->request('GET', $this->api_link . '/Locations?Archived=false', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->token,
                    'Content-Type' => 'application/json'
                ],
            ]);
            $data = json_decode($response->getBody()->getContents(), true);
            return $data;
        } catch (Exception $e) {
            if ($e->getCode() === 401) {
                // Token has expired, handle token expiration
                $newToken = $this->handleTokenExpiration($client, 'getLocations', $this->token);
                return $newToken;
            } else {
                // Handle other exceptions
                throw $e;
            }
        }
    }

    public function createLocation($data)
    {
        $client = new Client();
        try {
            $response = $client->request('POST', $this->api_link . '/Locations', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->token,
                    'Content-Type' => 'application/json'
                ],
                'json' => $data
            ]);
            $data = json_decode($response->getBody()->getContents(), true);
            return $data['id'];
        } catch (Exception $e) {
            if ($e->getCode() === 401) {
                // Token has expired, handle token expiration
                $newToken = $this->handleTokenExpiration($client, 'createLocation', $this->token, $data);
                return $newToken;
            } else {
                // Handle other exceptions
                Log::error('payroll create location');
                Log::error($e);
                throw $e;
            }
        }
    }

    // End Locations

    // Positions
    public function createPositions(Positions $position)
    {
        $client = new Client();
        try {
            $body = [
                'name' => $position->position,
            ];
            Log::info('payroll create positions: ' . $position->position);
            $response = $client->request('POST', $this->api_link . '/Positions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->token,
                    'Content-Type' => 'application/json'
                ],
                'json' => $body
            ]);

            return $response;
        } catch (Exception $e) {
            if ($e->getCode() === 401) {
                // Token has expired, handle token expiration
                Log::error('payroll token expired');
                $newToken = $this->handleTokenExpiration($client, 'createPositions', $this->token, $position);
                return $newToken;
            } else {
                // Handle other exceptions
                Log::error('payroll create positions error');
                Log::error($e);
                throw $e;
            }
            return ['status' => 'error', 'message' => $e->error];
        }
    }

    // End Positions

    private function handleTokenExpiration(Client $client, string $originalFunction, string $oldToken, $data = null)
    {
        // Make a request to the token endpoint to get a new token.
        // This will vary based on your API's authentication flow (e.g., using a refresh token or client credentials).
        // Let's assume you have a function called `getNewToken` that does this.
        $newToken = $this->getToken();

        // Store the new token for future requests
        $this->saveToken($newToken);

        // Re-run the original function with the new token
        return $this->$originalFunction($data);
    }

    private function saveToken(string $token)
    {
        $intergrations = Integrations::where('integration', 'payroll_panda')->first();
        $intergrations->update([
            'integration' => 'payroll_panda'
        ], [
            'token' => $token
        ]);
        $this->token = $token;
    }
}
