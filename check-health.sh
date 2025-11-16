#!/bin/bash
echo "🔍 Running Health Checks..."
echo ""

echo "1. TypeScript Check..."
pnpm typecheck > /dev/null 2>&1 && echo "✅ TypeScript OK" || echo "❌ TypeScript Failed"
echo ""

echo "2. Lint Check..."
pnpm lint > /dev/null 2>&1 && echo "✅ Lint OK" || echo "❌ Lint Failed"
echo ""

echo "3. Database Connection..."
psql -h localhost -U dev_user -d postgres_dev -c "SELECT 1;" > /dev/null 2>&1 && echo "✅ Database OK" || echo "❌ Database Not Running"
echo ""

echo "4. Environment Variables..."
[ -f .env ] && echo "✅ .env exists" || echo "❌ .env missing"
grep -q "GOOGLE_GENERATIVE_AI_API_KEY=AIza" .env 2>/dev/null && echo "✅ Gemini API Key set" || echo "⚠️  Gemini API Key missing"
grep -q "POSTGRES_URL=" .env 2>/dev/null && echo "✅ Database URL configured" || echo "❌ Database URL missing"
echo ""

echo "5. Node Modules..."
[ -d node_modules ] && echo "✅ Dependencies installed" || echo "❌ Run: pnpm install"
echo ""

echo "🎉 Health check complete!"
echo ""
echo "📖 See TESTING_GUIDE.md for full testing instructions"
