import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 10) {
      return NextResponse.json(
        { error: 'Valid Gemini API Key is required (minimum 10 characters)' },
        { status: 400 }
      );
    }

    const trimmedKey = apiKey.trim();

    // Verify key against Google Gemini API with a fast ping across modern models
    const testModels = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-3.6-flash'];
    let verified = false;
    let lastErrorMsg = '';

    for (const model of testModels) {
      try {
        const testRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${trimmedKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with OK' }] }],
            generationConfig: { maxOutputTokens: 5 },
          }),
        });

        if (testRes.ok) {
          verified = true;
          break;
        } else {
          const errBody = await testRes.json().catch(() => ({}));
          lastErrorMsg = errBody?.error?.message || `Status ${testRes.status}`;
        }
      } catch (err: any) {
        lastErrorMsg = err.message;
      }
    }

    if (!verified) {
      return NextResponse.json(
        { error: `Gemini API validation failed: ${lastErrorMsg}` },
        { status: 400 }
      );
    }


    // Key is verified! Persist into .env.local
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    if (/^GEMINI_API_KEY=.*$/m.test(envContent)) {
      envContent = envContent.replace(/^GEMINI_API_KEY=.*$/m, `GEMINI_API_KEY="${trimmedKey}"`);
    } else {
      envContent += `\n# Google Gemini API Key\nGEMINI_API_KEY="${trimmedKey}"\n`;
    }

    fs.writeFileSync(envPath, envContent, 'utf8');

    // Update in-memory runtime environment immediately
    process.env.GEMINI_API_KEY = trimmedKey;

    const masked = `${trimmedKey.slice(0, 6)}...${trimmedKey.slice(-4)}`;
    return NextResponse.json({
      success: true,
      message: 'Gemini API Key verified and saved successfully to .env.local',
      maskedKey: masked,
    });
  } catch (error: any) {
    console.error('Error saving Gemini key:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to persist Gemini API key' },
      { status: 500 }
    );
  }
}
