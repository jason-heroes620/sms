<?php

namespace App\Services;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use App\Models\Tenant\Integrations;
use Illuminate\Support\Facades\Log;

class JibbleService
{
    public $api_link, $client_id, $client_secret, $token;

    public function __construct()
    {
        $integrations = Integrations::where('integration', 'jibble')->first();
        $this->client_id = $integrations->client_id;
        $this->client_secret = $integrations->client_secret;
        $this->api_link = $integrations->api_link;
        $this->token = $integrations->token === null ? $this->getToken() : $integrations->token;
    }

    public function getToken()
    {
        $client = new Client();
        $options = [
            'form_params' => [
                'client_id' => $this->client_id,
                'client_secret' => $this->client_secret,
                'grant_type' => 'client_credentials',
            ]
        ];
        $request = new Request('POST', "https://identity.prod.jibble.io/connect/token");
        $response = $client->sendAsync($request, $options)->wait();
        $tokenData = json_decode($response->getBody()->getContents(), true);
        $this->saveToken($tokenData['access_token']);
        return $tokenData['access_token'];
    }

    public function createLocation($data)
    {
        $client = new Client();
        try {
            $response = $client->request('POST', $this->api_link . '/v1/Locations', [
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
                Log::error('jibble token expired');
                $newToken = $this->handleTokenExpiration($client, 'createLocation', $this->token, $data);
                return $newToken;
            } else {
                // Handle other exceptions
                Log::error('jibble create positions error');
                Log::error($e);
                throw $e;
            }
            return false;
        }
    }

    public function createMember($data)
    {
        $client = new Client();
        try {
            $response = $client->request('POST', $this->api_link . '/v1/People', [
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
                Log::error('jibble token expired');
                $newToken = $this->handleTokenExpiration($client, 'createMember', $this->token, $data);
                return $newToken;
            } else {
                // Handle other exceptions
                Log::error('jibble create positions error');
                Log::error($e);
                throw $e;
            }
            return false;
        }
    }

    private function handleTokenExpiration(Client $client, string $originalFunction, string $oldToken, $data = null)
    {
        // Make a request to the token endpoint to get a new token.
        // This will vary based on your API's authentication flow (e.g., using a refresh token or client credentials).
        // Let's assume you have a function called `getNewToken` that does this.
        $newToken = $this->getToken();

        // Store the new token for future requests
        // $this->saveToken($newToken);

        // Re-run the original function with the new token
        return $this->$originalFunction($data);
    }

    private function saveToken(string $token)
    {
        $integrations = Integrations::where('integration', 'jibble')->first();
        $integrations->update([
            'token' => $token
        ]);
        $this->token = $token;
    }
}
