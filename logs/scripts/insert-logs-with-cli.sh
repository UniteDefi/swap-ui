#!/bin/bash

# Script to insert all 11 log types into DynamoDB using AWS CLI
# This creates comprehensive logs for the first trade ID found in the system

LOGS_TABLE_NAME=${LOGS_TABLE_NAME:-"Logs"}
TRADE_ID="0x3da38d10ad77bff18f3174be5e08b79cd9a358daaca42ebbdafeb6a43b3d0a1b"

echo "🚀 Inserting all 11 log types into DynamoDB table: $LOGS_TABLE_NAME"
echo "📊 Trade ID: $TRADE_ID"

# Common values to maintain consistency
ORDER_HASH="0xd6c64c1f5a2b3e8d9c7f6e5a4b3c2d1e0f9e8d7c6b5a4f3e2d1c0b9a8e7d6c5451a"
SECRET_HASH="0xb43b69a6426fb8d7c9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2"
SECRET="0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0"
MAKER_ADDRESS="0x24b6cac3d9876543210abcdef9876543210abcdef"
RESOLVER_A="0x9876543210fedcba9876543210fedcba98765432"
RESOLVER_B="0x1234567890abcdef1234567890abcdef12345678"
RESOLVER_C="0xabcdef1234567890abcdef1234567890abcdef12"
SRC_ESCROW="0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b"
DST_ESCROW="0x5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e"

# Base timestamp (adjust this to current time if needed)
BASE_TIME="2024-01-01T12:00:00Z"

# Function to insert a log entry
insert_log() {
    local log_data="$1"
    echo "📝 Inserting log: $2"
    
    aws dynamodb put-item \
        --table-name "$LOGS_TABLE_NAME" \
        --item "$log_data" \
        --region us-east-1
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully inserted: $2"
    else
        echo "❌ Failed to insert: $2"
    fi
    sleep 0.2  # Small delay between inserts
}

echo ""
echo "1️⃣  ORDER CREATION (UI)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:00Z"},
    "title": {"S": "Order Created"},
    "source": {"S": "UI"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "User created swap order for 645.524211 USDT → 591.368479 USDT"},
    "logType": {"S": "order_creation"},
    "data": {"M": {
        "orderHash": {"S": "'$ORDER_HASH'"},
        "signature": {"S": "0xa1b2c3d4e5f6789012345678901234567890123456789012345678901234567890"},
        "secretHash": {"S": "'$SECRET_HASH'"},
        "srcToken": {"S": "USDT"},
        "dstToken": {"S": "USDT"},
        "srcAmount": {"S": "645.524211"},
        "dstAmount": {"S": "591.368479"},
        "srcChainId": {"N": "97"},
        "dstChainId": {"N": "11155111"},
        "makerAddress": {"S": "'$MAKER_ADDRESS'"},
        "deadline": {"S": "2024-01-01T12:05:00Z"}
    }},
    "txHash": {"S": "'$ORDER_HASH'"},
    "chainId": {"N": "97"}
}' "Order Creation"

echo ""
echo "2️⃣  ORDER BROADCAST (Relayer)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:01Z"},
    "title": {"S": "Order Broadcasted"},
    "source": {"S": "Relayer"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Relayer broadcasted order to all available resolvers"},
    "logType": {"S": "order_broadcast"},
    "data": {"M": {
        "orderHash": {"S": "'$ORDER_HASH'"},
        "broadcastTimestamp": {"S": "2024-01-01T12:00:01Z"},
        "resolversNotified": {"L": [
            {"S": "'$RESOLVER_A'"},
            {"S": "'$RESOLVER_B'"},
            {"S": "'$RESOLVER_C'"},
            {"S": "0xfedcba9876543210fedcba9876543210fedcba98"}
        ]},
        "resolverCount": {"N": "4"}
    }}
}' "Order Broadcast"

echo ""
echo "3️⃣  RESOLVER COMMITMENT (ResolverA - 45%)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:03Z"},
    "title": {"S": "45% Fill Commitment"},
    "source": {"S": "ResolverA"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Resolver committed to fill 266.115816 USDT"},
    "logType": {"S": "resolver_commitment"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_A'"},
        "commitmentHash": {"S": "0xc1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2"},
        "fillAmount": {"S": "266.115816"},
        "fillPercentage": {"N": "45"},
        "safetyDepositAmount": {"S": "26.611582"},
        "commitmentTxHash": {"S": "0xe3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4"},
        "chainId": {"N": "11155111"}
    }},
    "txHash": {"S": "0xe3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4"},
    "chainId": {"N": "11155111"}
}' "Resolver Commitment A"

echo ""
echo "3️⃣  RESOLVER COMMITMENT (ResolverB - 30%)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:03.500Z"},
    "title": {"S": "30% Fill Commitment"},
    "source": {"S": "ResolverB"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Resolver committed to fill 177.410544 USDT"},
    "logType": {"S": "resolver_commitment"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_B'"},
        "commitmentHash": {"S": "0xd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3"},
        "fillAmount": {"S": "177.410544"},
        "fillPercentage": {"N": "30"},
        "safetyDepositAmount": {"S": "17.741054"},
        "commitmentTxHash": {"S": "0xf4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5"},
        "chainId": {"N": "11155111"}
    }},
    "txHash": {"S": "0xf4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5"},
    "chainId": {"N": "11155111"}
}' "Resolver Commitment B"

echo ""
echo "3️⃣  RESOLVER COMMITMENT (ResolverC - 25%)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:04Z"},
    "title": {"S": "25% Fill Commitment"},
    "source": {"S": "ResolverC"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Resolver committed to fill 147.842119 USDT"},
    "logType": {"S": "resolver_commitment"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_C'"},
        "commitmentHash": {"S": "0xe3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4"},
        "fillAmount": {"S": "147.842119"},
        "fillPercentage": {"N": "25"},
        "safetyDepositAmount": {"S": "14.784212"},
        "commitmentTxHash": {"S": "0xa5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6"},
        "chainId": {"N": "11155111"}
    }},
    "txHash": {"S": "0xa5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6"},
    "chainId": {"N": "11155111"}
}' "Resolver Commitment C"

echo ""
echo "4️⃣  ESCROW DEPLOYMENT (Lead Resolver)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:07Z"},
    "title": {"S": "Escrows Deployed"},
    "source": {"S": "ResolverA"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Lead resolver deployed source and destination escrows"},
    "logType": {"S": "escrow_deployment"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_A'"},
        "srcEscrowAddress": {"S": "'$SRC_ESCROW'"},
        "dstEscrowAddress": {"S": "'$DST_ESCROW'"},
        "deploySrcTxHash": {"S": "0x0929a1b2c3d4e5f678901234567890123456789012345678901234567890a3cb"},
        "deployDstTxHash": {"S": "0x77a5b2c3d4e5f678901234567890123456789012345678901234567890132a2"},
        "srcChainId": {"N": "97"},
        "dstChainId": {"N": "11155111"},
        "gasUsed": {"M": {
            "src": {"S": "165432"},
            "dst": {"S": "158734"}
        }}
    }},
    "txHash": {"S": "0x0929a1b2c3d4e5f678901234567890123456789012345678901234567890a3cb"},
    "chainId": {"N": "97"}
}' "Escrow Deployment"

echo ""
echo "5️⃣  ASSET LOCK (Relayer)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:12Z"},
    "title": {"S": "Assets Locked"},
    "source": {"S": "Relayer"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Locked 645.524211 USDT in source escrow"},
    "logType": {"S": "asset_lock"},
    "data": {"M": {
        "lockTxHash": {"S": "0xa389c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f86960"},
        "amount": {"S": "645.524211"},
        "token": {"S": "USDT"},
        "escrowAddress": {"S": "'$SRC_ESCROW'"},
        "userAddress": {"S": "'$MAKER_ADDRESS'"},
        "chainId": {"N": "97"},
        "gasPrice": {"S": "25000000000"}
    }},
    "txHash": {"S": "0xa389c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f86960"},
    "chainId": {"N": "97"}
}' "Asset Lock"

echo ""
echo "6️⃣  DESTINATION FILL (ResolverA)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:14Z"},
    "title": {"S": "Destination Assets Filled"},
    "source": {"S": "ResolverA"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Filled 266.115816 USDT in destination escrow"},
    "logType": {"S": "destination_fill"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_A'"},
        "fillTxHash": {"S": "0xf7cd1a1b2c3d4e5f6789012345678901234567890123456789012345678902759"},
        "fillAmount": {"S": "266.115816"},
        "token": {"S": "USDT"},
        "escrowAddress": {"S": "'$DST_ESCROW'"},
        "chainId": {"N": "11155111"},
        "cumulativeFilled": {"S": "266.115816"},
        "remainingToFill": {"S": "325.252663"}
    }},
    "txHash": {"S": "0xf7cd1a1b2c3d4e5f6789012345678901234567890123456789012345678902759"},
    "chainId": {"N": "11155111"}
}' "Destination Fill A"

echo ""
echo "6️⃣  DESTINATION FILL (ResolverB)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:15Z"},
    "title": {"S": "Destination Assets Filled"},
    "source": {"S": "ResolverB"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Filled 177.410544 USDT in destination escrow"},
    "logType": {"S": "destination_fill"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_B'"},
        "fillTxHash": {"S": "0xcd2b3c4d5e6f789012345678901234567890123456789012345678901a3b4c5d"},
        "fillAmount": {"S": "177.410544"},
        "token": {"S": "USDT"},
        "escrowAddress": {"S": "'$DST_ESCROW'"},
        "chainId": {"N": "11155111"},
        "cumulativeFilled": {"S": "443.526360"},
        "remainingToFill": {"S": "147.842119"}
    }},
    "txHash": {"S": "0xcd2b3c4d5e6f789012345678901234567890123456789012345678901a3b4c5d"},
    "chainId": {"N": "11155111"}
}' "Destination Fill B"

echo ""
echo "6️⃣  DESTINATION FILL (ResolverC)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:16Z"},
    "title": {"S": "Destination Assets Filled"},
    "source": {"S": "ResolverC"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Filled 147.842119 USDT in destination escrow"},
    "logType": {"S": "destination_fill"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_C'"},
        "fillTxHash": {"S": "0x3c4d5e6f7890123456789012345678901234567890123456789012b4c5d6e7f"},
        "fillAmount": {"S": "147.842119"},
        "token": {"S": "USDT"},
        "escrowAddress": {"S": "'$DST_ESCROW'"},
        "chainId": {"N": "11155111"},
        "cumulativeFilled": {"S": "591.368479"},
        "remainingToFill": {"S": "0.000000"}
    }},
    "txHash": {"S": "0x3c4d5e6f7890123456789012345678901234567890123456789012b4c5d6e7f"},
    "chainId": {"N": "11155111"}
}' "Destination Fill C"

echo ""
echo "7️⃣  FILL COMPLETE (Relayer)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:17Z"},
    "title": {"S": "Order Fully Filled"},
    "source": {"S": "Relayer"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "All resolvers have filled their commitments"},
    "logType": {"S": "fill_complete"},
    "data": {"M": {
        "totalFilled": {"S": "591.368479"},
        "targetAmount": {"S": "591.368479"},
        "fillComplete": {"BOOL": true},
        "participatingResolvers": {"L": [
            {"S": "'$RESOLVER_A'"},
            {"S": "'$RESOLVER_B'"},
            {"S": "'$RESOLVER_C'"}
        ]},
        "completionTimestamp": {"S": "2024-01-01T12:00:17Z"}
    }}
}' "Fill Complete"

echo ""
echo "8️⃣  SECRET REVEAL (Relayer)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:19Z"},
    "title": {"S": "Secret Revealed"},
    "source": {"S": "Relayer"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Secret revealed to all participating resolvers"},
    "logType": {"S": "secret_reveal"},
    "data": {"M": {
        "secret": {"S": "'$SECRET'"},
        "secretHash": {"S": "'$SECRET_HASH'"},
        "broadcastTimestamp": {"S": "2024-01-01T12:00:19Z"},
        "sqsMessageId": {"S": "msg-abc123def"},
        "hashVerified": {"BOOL": true}
    }}
}' "Secret Reveal"

echo ""
echo "9️⃣  USER RELEASE (ResolverA)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:22Z"},
    "title": {"S": "Funds Released to User"},
    "source": {"S": "ResolverA"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Released 266.115816 USDT to user"},
    "logType": {"S": "user_release"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_A'"},
        "unlockTxHash": {"S": "0x4d5e6f78901234567890123456789012345678901234567890c5d6e7f8a9b0c1"},
        "amount": {"S": "266.115816"},
        "token": {"S": "USDT"},
        "recipient": {"S": "'$MAKER_ADDRESS'"},
        "chainId": {"N": "11155111"},
        "secret": {"S": "'$SECRET'"}
    }},
    "txHash": {"S": "0x4d5e6f78901234567890123456789012345678901234567890c5d6e7f8a9b0c1"},
    "chainId": {"N": "11155111"}
}' "User Release A"

echo ""
echo "9️⃣  USER RELEASE (ResolverB)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:22.500Z"},
    "title": {"S": "Funds Released to User"},
    "source": {"S": "ResolverB"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Released 177.410544 USDT to user"},
    "logType": {"S": "user_release"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_B'"},
        "unlockTxHash": {"S": "0x5e6f789012345678901234567890123456789012345678d6e7f8a9b0c1d2e3f4"},
        "amount": {"S": "177.410544"},
        "token": {"S": "USDT"},
        "recipient": {"S": "'$MAKER_ADDRESS'"},
        "chainId": {"N": "11155111"},
        "secret": {"S": "'$SECRET'"}
    }},
    "txHash": {"S": "0x5e6f789012345678901234567890123456789012345678d6e7f8a9b0c1d2e3f4"},
    "chainId": {"N": "11155111"}
}' "User Release B"

echo ""
echo "9️⃣  USER RELEASE (ResolverC)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:23Z"},
    "title": {"S": "Funds Released to User"},
    "source": {"S": "ResolverC"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Released 147.842119 USDT to user"},
    "logType": {"S": "user_release"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_C'"},
        "unlockTxHash": {"S": "0x6f78901234567890123456789012345678901234567e7f8a9b0c1d2e3f4a5b6c7"},
        "amount": {"S": "147.842119"},
        "token": {"S": "USDT"},
        "recipient": {"S": "'$MAKER_ADDRESS'"},
        "chainId": {"N": "11155111"},
        "secret": {"S": "'$SECRET'"}
    }},
    "txHash": {"S": "0x6f78901234567890123456789012345678901234567e7f8a9b0c1d2e3f4a5b6c7"},
    "chainId": {"N": "11155111"}
}' "User Release C"

echo ""
echo "🔟 SAFETY RECOVERY (ResolverA)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:24Z"},
    "title": {"S": "Safety Deposit Recovered"},
    "source": {"S": "ResolverA"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Recovered safety deposit from destination escrow"},
    "logType": {"S": "safety_recovery"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_A'"},
        "claimTxHash": {"S": "0x789012345678901234567890123456789012345f8a9b0c1d2e3f4a5b6c7d8e9f0"},
        "safetyAmount": {"S": "26.611582"},
        "token": {"S": "USDT"},
        "chainId": {"N": "11155111"},
        "escrowAddress": {"S": "'$DST_ESCROW'"}
    }},
    "txHash": {"S": "0x789012345678901234567890123456789012345f8a9b0c1d2e3f4a5b6c7d8e9f0"},
    "chainId": {"N": "11155111"}
}' "Safety Recovery A"

echo ""
echo "🔟 SAFETY RECOVERY (ResolverB)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:24.800Z"},
    "title": {"S": "Safety Deposit Recovered"},
    "source": {"S": "ResolverB"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Recovered safety deposit from destination escrow"},
    "logType": {"S": "safety_recovery"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_B'"},
        "claimTxHash": {"S": "0x90123456789012345678901234567890123a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3"},
        "safetyAmount": {"S": "17.741054"},
        "token": {"S": "USDT"},
        "chainId": {"N": "11155111"},
        "escrowAddress": {"S": "'$DST_ESCROW'"}
    }},
    "txHash": {"S": "0x90123456789012345678901234567890123a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3"},
    "chainId": {"N": "11155111"}
}' "Safety Recovery B"

echo ""
echo "🔟 SAFETY RECOVERY (ResolverC)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:25.600Z"},
    "title": {"S": "Safety Deposit Recovered"},
    "source": {"S": "ResolverC"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Recovered safety deposit from destination escrow"},
    "logType": {"S": "safety_recovery"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_C'"},
        "claimTxHash": {"S": "0x123456789012345678901234567b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9"},
        "safetyAmount": {"S": "14.784212"},
        "token": {"S": "USDT"},
        "chainId": {"N": "11155111"},
        "escrowAddress": {"S": "'$DST_ESCROW'"}
    }},
    "txHash": {"S": "0x123456789012345678901234567b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9"},
    "chainId": {"N": "11155111"}
}' "Safety Recovery C"

echo ""
echo "1️⃣1️⃣ SOURCE COLLECT (ResolverA)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:25Z"},
    "title": {"S": "Source Assets Collected"},
    "source": {"S": "ResolverA"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Collected rewards and safety deposit from source escrow"},
    "logType": {"S": "source_collect"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_A'"},
        "collectTxHash": {"S": "0x23456789012345678901234c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2"},
        "rewardAmount": {"S": "290.485895"},
        "safetyAmount": {"S": "26.611582"},
        "totalAmount": {"S": "317.097477"},
        "token": {"S": "USDT"},
        "chainId": {"N": "97"},
        "escrowAddress": {"S": "'$SRC_ESCROW'"}
    }},
    "txHash": {"S": "0x23456789012345678901234c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2"},
    "chainId": {"N": "97"}
}' "Source Collect A"

echo ""
echo "1️⃣1️⃣ SOURCE COLLECT (ResolverB)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:25.800Z"},
    "title": {"S": "Source Assets Collected"},
    "source": {"S": "ResolverB"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Collected rewards and safety deposit from source escrow"},
    "logType": {"S": "source_collect"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_B'"},
        "collectTxHash": {"S": "0x3456789012345678901d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5"},
        "rewardAmount": {"S": "193.657263"},
        "safetyAmount": {"S": "17.741054"},
        "totalAmount": {"S": "211.398317"},
        "token": {"S": "USDT"},
        "chainId": {"N": "97"},
        "escrowAddress": {"S": "'$SRC_ESCROW'"}
    }},
    "txHash": {"S": "0x3456789012345678901d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5"},
    "chainId": {"N": "97"}
}' "Source Collect B"

echo ""
echo "1️⃣1️⃣ SOURCE COLLECT (ResolverC)"
insert_log '{
    "tradeId": {"S": "'$TRADE_ID'"},
    "timestamp": {"S": "2024-01-01T12:00:26.600Z"},
    "title": {"S": "Source Assets Collected"},
    "source": {"S": "ResolverC"},
    "orderId": {"S": "'$ORDER_HASH'"},
    "description": {"S": "Collected rewards and safety deposit from source escrow"},
    "logType": {"S": "source_collect"},
    "data": {"M": {
        "resolverAddress": {"S": "'$RESOLVER_C'"},
        "collectTxHash": {"S": "0x456789012345678e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8"},
        "rewardAmount": {"S": "161.381053"},
        "safetyAmount": {"S": "14.784212"},
        "totalAmount": {"S": "176.165265"},
        "token": {"S": "USDT"},
        "chainId": {"N": "97"},
        "escrowAddress": {"S": "'$SRC_ESCROW'"}
    }},
    "txHash": {"S": "0x456789012345678e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8"},
    "chainId": {"N": "97"}
}' "Source Collect C"

echo ""
echo "🎉 COMPLETE! All 11 log types have been inserted:"
echo "   📋 Total logs inserted: 20 (includes multiple resolver entries)"
echo "   🔄 Trade ID: $TRADE_ID"
echo "   ⏱️  Timespan: 2024-01-01T12:00:00Z to 2024-01-01T12:00:26.600Z"
echo ""
echo "   ✅ 1. Order Creation (UI)"
echo "   ✅ 2. Order Broadcast (Relayer)"
echo "   ✅ 3. Resolver Commitment (3x Resolvers)"
echo "   ✅ 4. Escrow Deployment (Lead Resolver)"
echo "   ✅ 5. Asset Lock (Relayer)"
echo "   ✅ 6. Destination Fill (3x Resolvers)"
echo "   ✅ 7. Fill Complete (Relayer)"
echo "   ✅ 8. Secret Reveal (Relayer)"
echo "   ✅ 9. User Release (3x Resolvers)"
echo "   ✅ 10. Safety Recovery (3x Resolvers)"
echo "   ✅ 11. Source Collect (3x Resolvers)"
echo ""
echo "🚀 Ready to test enhanced logs UI! Open the trade details dialog for trade:"
echo "   $TRADE_ID"