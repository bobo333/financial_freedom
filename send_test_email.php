<?php
    require 'vendor/autoload.php';

    use Aws\Ses\SesClient;
    $client = SesClient::factory(array(
        'key'    => 'AKIAIZ4RXLXWMVS4OPBQ',
        'secret' => '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',
        'region' => 'us-west-2'
    ));

    //Now that you have the client ready, you can build the message 
    $msg = array();
    $msg['Source'] = "redsox333@gmail.com";
    //ToAddresses must be an array
    $msg['Destination']['ToAddresses'][] = "redsox333@gmail.com";

    $msg['Message']['Subject']['Data'] = "Text only subject eh";
    $msg['Message']['Subject']['Charset'] = "UTF-8";

    $msg['Message']['Body']['Text']['Data'] ="Text data of email";
    $msg['Message']['Body']['Text']['Charset'] = "UTF-8";
    $msg['Message']['Body']['Html']['Data'] ="HTML Data of email<br />";
    $msg['Message']['Body']['Html']['Charset'] = "UTF-8";

    try{
         $result = $client->sendEmail($msg);

         //save the MessageId which can be used to track the request
         $msg_id = $result->get('MessageId');
         echo("MessageId: $msg_id");

         //view sample output 
         print_r($result);
    } catch (Exception $e) {
         //An error happened and the email did not get sent
         echo($e->getMessage());
    } 
    //view the original message passed to the SDK 
    print_r($msg);