"""
AIthusiast Backend API Tests
Tests all endpoints with the public URL
"""
import requests
import sys
import time
from datetime import datetime

class AIthusiastAPITester:
    def __init__(self, base_url="https://ai-finder-49.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None, timeout=10):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            else:
                print(f"❌ Failed - Unsupported method: {method}")
                self.failed_tests.append({"test": name, "reason": f"Unsupported method: {method}"})
                return False, {}

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.text[:200]}")
                except:
                    pass
                self.failed_tests.append({"test": name, "reason": f"Status {response.status_code} != {expected_status}"})
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout after {timeout}s")
            self.failed_tests.append({"test": name, "reason": f"Timeout after {timeout}s"})
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({"test": name, "reason": str(e)})
            return False, {}

    def test_health(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "/health",
            200
        )
        if success:
            print(f"   Tools count: {response.get('tools', 0)}")
            print(f"   LLM ready: {response.get('llm_ready', False)}")
        return success

    def test_categories(self):
        """Test categories endpoint - should return 10 categories"""
        success, response = self.run_test(
            "Categories Endpoint",
            "GET",
            "/categories",
            200
        )
        if success:
            if isinstance(response, list):
                print(f"   Categories count: {len(response)}")
                if len(response) >= 10:
                    print(f"   ✓ Has 10+ categories")
                else:
                    print(f"   ⚠ Expected 10+ categories, got {len(response)}")
            else:
                print(f"   ⚠ Response is not a list")
        return success

    def test_tools_list(self):
        """Test tools listing - should return 54 tools"""
        success, response = self.run_test(
            "Tools List (All)",
            "GET",
            "/tools",
            200,
            params={"limit": 60}
        )
        if success:
            if isinstance(response, list):
                print(f"   Tools count: {len(response)}")
                if len(response) >= 54:
                    print(f"   ✓ Has 54+ tools")
                else:
                    print(f"   ⚠ Expected 54+ tools, got {len(response)}")
            else:
                print(f"   ⚠ Response is not a list")
        return success

    def test_tools_trending(self):
        """Test trending tools"""
        success, response = self.run_test(
            "Tools List (Trending)",
            "GET",
            "/tools",
            200,
            params={"trending": "true"}
        )
        if success and isinstance(response, list):
            print(f"   Trending tools: {len(response)}")
        return success

    def test_tools_by_category(self):
        """Test tools filtering by category"""
        success, response = self.run_test(
            "Tools List (Category Filter)",
            "GET",
            "/tools",
            200,
            params={"category": "coding"}
        )
        if success and isinstance(response, list):
            print(f"   Coding tools: {len(response)}")
        return success

    def test_tools_ranking(self):
        """Test NEW Phase 3 endpoint: /api/tools/ranking - top 10 trending tools"""
        success, response = self.run_test(
            "Tools Ranking (NEW Phase 3)",
            "GET",
            "/tools/ranking",
            200,
            params={"limit": 10}
        )
        if success:
            if isinstance(response, list):
                print(f"   Ranking tools count: {len(response)}")
                if len(response) == 10:
                    print(f"   ✓ Returns exactly 10 trending tools")
                    # Verify ranking order and fields
                    for i, tool in enumerate(response):
                        rank = tool.get('rank')
                        name = tool.get('name', 'N/A')
                        growth = tool.get('weekly_growth', '')
                        popularity = tool.get('popularity', 0)
                        if i == 0:
                            print(f"   #1: {name} (rank={rank}, growth={growth}, popularity={popularity})")
                        if rank != i + 1:
                            print(f"   ⚠ Rank mismatch at position {i+1}: expected rank={i+1}, got rank={rank}")
                    # Check top 3 tools
                    if len(response) >= 3:
                        print(f"   Top 3: {response[0].get('name')}, {response[1].get('name')}, {response[2].get('name')}")
                else:
                    print(f"   ⚠ Expected 10 tools, got {len(response)}")
            else:
                print(f"   ⚠ Response is not a list")
        return success

    def test_tool_detail(self):
        """Test tool detail page - Phase 3: should include rank, weekly_growth, popularity for trending tools"""
        success, response = self.run_test(
            "Tool Detail (chatgpt)",
            "GET",
            "/tools/chatgpt",
            200
        )
        if success:
            print(f"   Tool name: {response.get('name', 'N/A')}")
            # Phase 3: Check for new trending fields
            rank = response.get('rank')
            growth = response.get('weekly_growth', '')
            popularity = response.get('popularity', 0)
            if rank:
                print(f"   ✓ Phase 3 fields: rank={rank}, growth={growth}, popularity={popularity}")
            else:
                print(f"   ℹ Not a trending tool (no rank)")
        return success

    def test_tool_detail_midjourney(self):
        """Test tool detail page for midjourney"""
        success, response = self.run_test(
            "Tool Detail (midjourney)",
            "GET",
            "/tools/midjourney",
            200
        )
        if success:
            print(f"   Tool name: {response.get('name', 'N/A')}")
        return success

    def test_similar_tools(self):
        """Test similar tools endpoint"""
        success, response = self.run_test(
            "Similar Tools (chatgpt)",
            "GET",
            "/tools/chatgpt/similar",
            200
        )
        if success and isinstance(response, list):
            print(f"   Similar tools: {len(response)}")
        return success

    def test_articles_list(self):
        """Test articles listing - should return 12 articles"""
        success, response = self.run_test(
            "Articles List (All)",
            "GET",
            "/articles",
            200
        )
        if success:
            if isinstance(response, list):
                print(f"   Articles count: {len(response)}")
                if len(response) >= 12:
                    print(f"   ✓ Has 12+ articles")
                else:
                    print(f"   ⚠ Expected 12+ articles, got {len(response)}")
            else:
                print(f"   ⚠ Response is not a list")
        return success

    def test_articles_featured(self):
        """Test featured articles"""
        success, response = self.run_test(
            "Articles List (Featured)",
            "GET",
            "/articles",
            200,
            params={"featured": "true"}
        )
        if success and isinstance(response, list):
            print(f"   Featured articles: {len(response)}")
        return success

    def test_article_detail(self):
        """Test article detail page"""
        success, response = self.run_test(
            "Article Detail (best-ai-for-students-2026)",
            "GET",
            "/articles/best-ai-for-students-2026",
            200
        )
        if success:
            print(f"   Article title: {response.get('title', 'N/A')}")
            sections = response.get('sections', [])
            print(f"   Sections count: {len(sections)}")
        return success

    def test_stacks_list(self):
        """Test stacks listing - should return 6 stacks"""
        success, response = self.run_test(
            "Stacks List",
            "GET",
            "/stacks",
            200
        )
        if success:
            if isinstance(response, list):
                print(f"   Stacks count: {len(response)}")
                if len(response) >= 6:
                    print(f"   ✓ Has 6+ stacks")
                else:
                    print(f"   ⚠ Expected 6+ stacks, got {len(response)}")
            else:
                print(f"   ⚠ Response is not a list")
        return success

    def test_stack_detail(self):
        """Test stack detail page"""
        success, response = self.run_test(
            "Stack Detail (best-ai-stack-for-students)",
            "GET",
            "/stacks/best-ai-stack-for-students",
            200
        )
        if success:
            print(f"   Stack title: {response.get('title', 'N/A')}")
            tools = response.get('tool_ids', [])
            print(f"   Tools in stack: {len(tools)}")
        return success

    def test_suggestions(self):
        """Test suggestions endpoint"""
        success, response = self.run_test(
            "Suggestions Endpoint",
            "GET",
            "/suggestions",
            200
        )
        if success:
            prompts = response.get('prompts', [])
            print(f"   Suggestion prompts: {len(prompts)}")
        return success

    def test_ai_search_simple(self):
        """Test AI search with simple query (keyword fallback acceptable)"""
        print("\n⚠️  Note: This test may take 5-15 seconds for LLM response")
        success, response = self.run_test(
            "AI Search (midjourney - keyword test)",
            "POST",
            "/search",
            200,
            data={"query": "midjourney"},
            timeout=20
        )
        if success:
            print(f"   Source: {response.get('source', 'N/A')}")
            print(f"   Intent: {response.get('intent', 'N/A')[:80]}")
            recs = response.get('recommendations', [])
            tools = response.get('tools', [])
            print(f"   Recommendations: {len(recs)}")
            print(f"   Tools returned: {len(tools)}")
            if len(recs) > 0:
                print(f"   Top recommendation: {recs[0].get('tool_id', 'N/A')}")
        return success

    def test_ai_search_llm(self):
        """Test AI search with LLM query - CRITICAL FEATURE"""
        print("\n⚠️  Note: This test may take 5-15 seconds for LLM response")
        success, response = self.run_test(
            "AI Search (AI for coding - LLM test)",
            "POST",
            "/search",
            200,
            data={"query": "AI for coding"},
            timeout=20
        )
        if success:
            source = response.get('source', 'N/A')
            print(f"   Source: {source}")
            print(f"   Intent: {response.get('intent', 'N/A')[:80]}")
            recs = response.get('recommendations', [])
            tools = response.get('tools', [])
            print(f"   Recommendations: {len(recs)}")
            print(f"   Tools returned: {len(tools)}")
            if len(recs) > 0:
                print(f"   Top recommendation: {recs[0].get('tool_id', 'N/A')} - {recs[0].get('why', 'N/A')[:60]}")
            # Check if LLM is working
            if source == 'llm':
                print(f"   ✓ LLM is working!")
            else:
                print(f"   ⚠ Using fallback (LLM may not be working)")
        return success

    def test_ai_search_complex(self):
        """Test AI search with complex query"""
        print("\n⚠️  Note: This test may take 5-15 seconds for LLM response")
        success, response = self.run_test(
            "AI Search (AI for cinematic images)",
            "POST",
            "/search",
            200,
            data={"query": "AI for cinematic images"},
            timeout=20
        )
        if success:
            print(f"   Source: {response.get('source', 'N/A')}")
            recs = response.get('recommendations', [])
            print(f"   Recommendations: {len(recs)}")
        return success

def main():
    print("=" * 70)
    print("AIthusiast Backend API Tests")
    print("=" * 70)
    print(f"Testing against: https://ai-finder-49.preview.emergentagent.com/api")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)

    tester = AIthusiastAPITester()

    # Run all tests
    print("\n" + "=" * 70)
    print("BASIC ENDPOINTS")
    print("=" * 70)
    tester.test_health()
    tester.test_categories()
    tester.test_suggestions()

    print("\n" + "=" * 70)
    print("TOOLS ENDPOINTS")
    print("=" * 70)
    tester.test_tools_list()
    tester.test_tools_ranking()  # NEW Phase 3 endpoint
    tester.test_tools_trending()
    tester.test_tools_by_category()
    tester.test_tool_detail()
    tester.test_tool_detail_midjourney()
    tester.test_similar_tools()

    print("\n" + "=" * 70)
    print("ARTICLES ENDPOINTS")
    print("=" * 70)
    tester.test_articles_list()
    tester.test_articles_featured()
    tester.test_article_detail()

    print("\n" + "=" * 70)
    print("STACKS ENDPOINTS")
    print("=" * 70)
    tester.test_stacks_list()
    tester.test_stack_detail()

    print("\n" + "=" * 70)
    print("AI SEARCH ENDPOINTS (CRITICAL FEATURE)")
    print("=" * 70)
    tester.test_ai_search_simple()
    tester.test_ai_search_llm()
    tester.test_ai_search_complex()

    # Print results
    print("\n" + "=" * 70)
    print("TEST RESULTS")
    print("=" * 70)
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"Success rate: {success_rate:.1f}%")
    
    if tester.failed_tests:
        print("\n❌ Failed tests:")
        for ft in tester.failed_tests:
            print(f"   • {ft['test']}: {ft['reason']}")
    
    print("=" * 70)
    
    # Return exit code based on success rate
    if success_rate >= 80:
        print("✅ Backend tests PASSED (>=80%)")
        return 0
    else:
        print("❌ Backend tests FAILED (<80%)")
        return 1

if __name__ == "__main__":
    sys.exit(main())
