// Netlify Functions 入口点
const express = require('express');
const serverless = require('serverless-http');

// 导入现有的Express应用
const app = require('../../server');

// 为Netlify Functions包装Express应用
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // 设置context以避免超时
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const result = await handler(event, context);
    return result;
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};