<?php

require 'vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

header('Content-Type: application/json');

// =================================================================
// --- CONFIGURAÇÕES E MAPEAMENTOS ---
// =================================================================

// Credenciais da Kommo
$subdomain = 'nanisound';
$accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1ZWRmM2I3ZDQ3OTMzYTA2MzcyMTI0ZTc4MmQ0MWFhYzVhNWY1ZjU4YmMzYzNkN2E0ZTFkNWMyMTEyZjc1MDljMmQ0N2E5YzM0YWMxNWNkIn0.eyJhdWQiOiJjYzMzOTFkNS0xZTcwLTRjNTctYWI3OC05NDU2ODM2ZjJkNTgiLCJqdGkiOiI2NWVkZjNiN2Q0NzkzM2EwNjM3MjEyNGU3ODJkNDFhYWM1YTVmNWY1OGJjM2MzZDdhNGUxZDVjMjExMmY3NTA5YzJkNDdhOWMzNGFjMTVjZCIsImlhdCI6MTc1ODExNzk3MywibmJmIjoxNzU4MTE3OTczLCJleHAiOjE5MTU4MzM2MDAsInN1YiI6IjEzODE3OTM2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM1MTY3Mjk2LCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwidXNlcl9mbGFncyI6MCwiaGFzaF91dWlkIjoiM2E3NjA1Y2YtZDc3Ny00ZTlmLTljNGQtOTcyZGUzYzY2YWUwIiwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.HyYuo6UIEGKo4fGi30cmB2oxwyIEtBft4inhRsJT7JIe_1VkZkeOhYZjWBX_JzSnB8GWLWMEcXQlzpjpHGbwJVPmYcwXp3od3U7pFm_rGCGIWO4Y3yRYo-4FY6RMxKCMPzN3QkHCOsUeMm_2iq4jhemtfuDGFzzMlnnGlkQ0inm6mgCN-iiYXd088UFo-dAXdv32__jzo58XiyK1MgsRnQL-570pQdPdV-zU8kbZOa320W_EJpttnpSeWRySKtVQ7ZKPWDzvf0Gi10voyly6A_s0LjdkROy3_U1hgA2kYlyfkfdOwjAuZ4GDnCzDn5LdU71mlTO_m8YzkyJPcZ2WQQ';

// --- IDs de Campos e Funis da Kommo ---
$kommoFieldIds = [
    'pipeline_principal'    => 11952276,
    'contato_email'         => 'EMAIL',
    'contato_telefone'      => 'PHONE',
    'lead_cep'              => 684098,
    'lead_estado_selecao'   => 97916,
    'lead_cidade_texto'     => 97970,
    'lead_ocupacao_selecao' => 97748,
    'lead_invest_selecao'   => 684096,
    'lead_objetivo_texto'   => 735354,
    'utm_source'            => 95985,
    'utm_medium'            => 95981,
    'utm_campaign'          => 95983,
    'utm_term'              => 95987,
    'utm_content'           => 95979,
];

// --- Mapeamento de VALOR DO FORMULÁRIO para ID DA KOMMO ---
$estadosMap = [
    'AC' => 565012, 'AL' => 564912, 'AP' => 565014, 'AM' => 564994, 'BA' => 564904,
    'CE' => 564998, 'DF' => 564898, 'ES' => 564894, 'GO' => 564890, 'MA' => 564996,
    'MT' => 564884, 'MS' => 564892, 'MG' => 564882, 'PA' => 564910, 'PB' => 564896,
    'PR' => 564886, 'PE' => 564900, 'PI' => 565064, 'RJ' => 564880, 'RN' => 564908,
    'RS' => 564878, 'RO' => 565000, 'RR' => 565016, 'SC' => 564902, 'SP' => 564888,
    'SE' => 564992, 'TO' => 564906,
];

$ocupacaoMap = [
    'Empreendedor/empresário' => 79446,
    'Funcionário CLT'         => 79664,
    'Funcionário público'     => 79448,
    'Aposentado'              => 79444,
    'Investidor'              => 79450,
    'Outro'                   => 555078,
];

$faixasCapitalMap = [
    'De 100 mil a 199 mil' => 555112,
    'De 200 mil a 299 mil' => 555114,
    'De 300 mil a 399 mil' => 555116,
    'Acima de 400 mil'     => 555118,
];

// =================================================================
// --- LÓGICA DE PROCESSAMENTO ---
// =================================================================

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

error_log("Dados recebidos do formulário: " . print_r($data, true));

if (empty($data['Nome']) || empty($data['Email']) || empty($data['Telefone'])) {
    echo json_encode(['success' => false, 'message' => 'Dados de formulário incompletos.']);
    exit;
}

try {
    $client = new Client(['base_uri' => "https://{$subdomain}.kommo.com/"]);

    // Passo 1: Criar o Contato
    $contact_data = [[
        'first_name' => $data['Nome'],
        'custom_fields_values' => [
            ['field_code' => $kommoFieldIds['contato_email'], 'values' => [['value' => $data['Email']]]],
            ['field_code' => $kommoFieldIds['contato_telefone'], 'values' => [['value' => $data['Telefone']]]],
        ]
    ]];
    $contact_response = $client->post('api/v4/contacts', [
        'headers' => ['Content-Type' => 'application/json', 'Authorization' => "Bearer {$accessToken}"],
        'json' => $contact_data
    ]);
    $contact_body = json_decode($contact_response->getBody(), true);
    $contact_id = $contact_body['_embedded']['contacts'][0]['id'];

    // Passo 2: Construir campos personalizados do Lead
    $custom_fields = [];

    // Função auxiliar para adicionar campos (suporte a texto e enum_id)
    function addCustomField(&$fields, $fieldId, $value, $isEnum = false)
    {
        if (!empty($value)) {
            $fields[] = [
                'field_id' => $fieldId,
                'values' => [
                    $isEnum ? ['enum_id' => $value] : ['value' => $value]
                ]
            ];
        }
    }

    // Campos de texto
    addCustomField($custom_fields, $kommoFieldIds['lead_cep'], $data['cep']);
    addCustomField($custom_fields, $kommoFieldIds['lead_cidade_texto'], $data['Cidade']);
    addCustomField($custom_fields, $kommoFieldIds['lead_objetivo_texto'], $data['objetivo']);

    // Campos de seleção (enum_id)
    if (!empty($data['Estado']) && isset($estadosMap[$data['Estado']])) {
        addCustomField($custom_fields, $kommoFieldIds['lead_estado_selecao'], $estadosMap[$data['Estado']], true);
    }
    if (!empty($data['cargo']) && isset($ocupacaoMap[$data['cargo']])) {
        addCustomField($custom_fields, $kommoFieldIds['lead_ocupacao_selecao'], $ocupacaoMap[$data['cargo']], true);
    }
    if (!empty($data['Faixas_Capital']) && isset($faixasCapitalMap[$data['Faixas_Capital']])) {
        addCustomField($custom_fields, $kommoFieldIds['lead_invest_selecao'], $faixasCapitalMap[$data['Faixas_Capital']], true);
    }

    // Campos UTM (texto normal)
    addCustomField($custom_fields, $kommoFieldIds['utm_source'], $data['utm_source']);
    addCustomField($custom_fields, $kommoFieldIds['utm_medium'], $data['utm_medium']);
    addCustomField($custom_fields, $kommoFieldIds['utm_campaign'], $data['utm_campaign']);
    addCustomField($custom_fields, $kommoFieldIds['utm_term'], $data['utm_term']);
    addCustomField($custom_fields, $kommoFieldIds['utm_content'], $data['utm_content']);

    // Passo 3: Criar o Lead
    $kommo_data = [[
        'name' => 'Novo lead de ' . $data['Nome'],
        'pipeline_id' => $kommoFieldIds['pipeline_principal'],
        'custom_fields_values' => $custom_fields,
        '_embedded' => ['contacts' => [['id' => $contact_id]]]
    ]];

    error_log("Payload enviado para a Kommo (Lead): " . print_r($kommo_data, true));

    $lead_response = $client->post('api/v4/leads', [
        'headers' => ['Content-Type' => 'application/json', 'Authorization' => "Bearer {$accessToken}"],
        'json' => $kommo_data
    ]);
    $lead_body = json_decode($lead_response->getBody(), true);

    if (isset($lead_body['_embedded']['leads'][0]['id'])) {
        echo json_encode(['success' => true, 'message' => 'Lead criado com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro desconhecido ao criar lead.', 'response' => $lead_body]);
    }
} catch (ClientException $e) {
    $responseBody = $e->getResponse()->getBody()->getContents();
    $errorData = json_decode($responseBody, true);
    error_log("Erro na API da Kommo: " . print_r($errorData, true));
    echo json_encode(['success' => false, 'message' => 'Erro na API da Kommo.', 'details' => $errorData]);
} catch (\Exception $e) {
    error_log("Erro interno no servidor: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Ocorreu um erro interno no servidor.']);
}
