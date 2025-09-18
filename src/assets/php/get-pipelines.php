<?php

require 'vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

// --- Substitua pelos seus dados ---
$subdomain = 'nanisound';
$accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1ZWRmM2I3ZDQ3OTMzYTA2MzcyMTI0ZTc4MmQ0MWFhYzVhNWY1ZjU4YmMzYzNkN2E0ZTFkNWMyMTEyZjc1MDljMmQ0N2E5YzM0YWMxNWNkIn0.eyJhdWQiOiJjYzMzOTFkNS0xZTcwLTRjNTctYWI3OC05NDU2ODM2ZjJkNTgiLCJqdGkiOiI2NWVkZjNiN2Q0NzkzM2EwNjM3MjEyNGU3ODJkNDFhYWM1YTVmNWY1OGJjM2MzZDdhNGUxZDVjMjExMmY3NTA5YzJkNDdhOWMzNGFjMTVjZCIsImlhdCI6MTc1ODExNzk3MywibmJmIjoxNzU4MTE3OTczLCJleHAiOjE5MTU4MzM2MDAsInN1YiI6IjEzODE3OTM2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM1MTY3Mjk2LCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwidXNlcl9mbGFncyI6MCwiaGFzaF91dWlkIjoiM2E3NjA1Y2YtZDc3Ny00ZTlmLTljNGQtOTcyZGUzYzY2YWUwIiwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.HyYuo6UIEGKo4fGi30cmB2oxwyIEtBft4inhRsJT7JIe_1VkZkeOhYZjWBX_JzSnB8GWLWMEcXQlzpjpHGbwJVPmYcwXp3od3U7pFm_rGCGIWO4Y3yRYo-4FY6RMxKCMPzN3QkHCOsUeMm_2iq4jhemtfuDGFzzMlnnGlkQ0inm6mgCN-iiYXd088UFo-dAXdv32__jzo58XiyK1MgsRnQL-570pQdPdV-zU8kbZOa320W_EJpttnpSeWRySKtVQ7ZKPWDzvf0Gi10voyly6A_s0LjdkROy3_U1hgA2kYlyfkfdOwjAuZ4GDnCzDn5LdU71mlTO_m8YzkyJPcZ2WQQ';
// ------------------------------------

$apiUrl = "https://{$subdomain}.kommo.com/api/v4/leads/pipelines";

try {
    $client = new Client();
    $response = $client->get($apiUrl, [
        'headers' => [
            'Authorization' => "Bearer {$accessToken}",
        ]
    ]);

    $data = json_decode($response->getBody()->getContents(), true);

    echo "<pre>";
    if (isset($data['_embedded']['pipelines'])) {
        foreach ($data['_embedded']['pipelines'] as $pipeline) {
            echo "========================================\n";
            echo "Funil: " . $pipeline['name'] . "\n";
            echo "ID do Funil: " . $pipeline['id'] . "\n";
            echo "----------------------------------------\n";
            
            if (!empty($pipeline['_embedded']['statuses'])) {
                echo "Status neste funil:\n";
                foreach ($pipeline['_embedded']['statuses'] as $status) {
                    echo "  - Nome: " . $status['name'] . "\n";
                    echo "    ID do Status: " . $status['id'] . "\n";
                }
            }
            echo "\n";
        }
    } else {
        echo "Nenhum funil encontrado ou a resposta da API está incompleta.";
    }
    echo "</pre>";

} catch (ClientException $e) {
    echo "Erro na requisição à API: " . $e->getResponse()->getBody()->getContents();
} catch (\Exception $e) {
    echo "Ocorreu um erro: " . $e->getMessage();
}

?>