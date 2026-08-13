from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_api():
    print("Testing /health...")
    r = client.get("/health")
    assert r.status_code == 200, f"Health failed: {r.text}"
    print("  Health:", r.json())

    print("\nTesting /products...")
    r = client.get("/products")
    assert r.status_code == 200, f"Products failed: {r.text}"
    products = r.json()
    print(f"  Loaded {len(products)} products.")
    assert len(products) >= 3

    print("\nTesting /products/6205-2RSH...")
    r = client.get("/products/6205-2RSH")
    assert r.status_code == 200, f"Product detail failed: {r.text}"
    p = r.json()
    print(f"  Product SKU: {p['sku']}, Name: {p['product_name']}, Conf: {p['overall_confidence']}")

    print("\nTesting /products/6205-2RSH/explain/bore_diameter...")
    r = client.get("/products/6205-2RSH/explain/bore_diameter")
    assert r.status_code == 200, f"Explain failed: {r.text}"
    exp = r.json()
    print(f"  Field: {exp['field']}, Val: {exp['final_value']}, Status: {exp['status']}")
    print(f"  Evidence: {exp['candidates'][0]['evidence']['snippet']}")

    print("\nTesting /review...")
    r = client.get("/review")
    assert r.status_code == 200, f"Review failed: {r.text}"
    queue = r.json()
    print(f"  Review queue items count: {len(queue)}")

    print("\nTesting /export/json and /export/csv...")
    r_json = client.get("/export/json")
    assert r_json.status_code == 200
    r_csv = client.get("/export/csv")
    assert r_csv.status_code == 200
    print("  Export JSON and CSV working properly.")

    print("\nTesting /metrics...")
    r_metrics = client.get("/metrics")
    assert r_metrics.status_code == 200
    print("  Metrics:", r_metrics.json())

    print("\nALL API ENDPOINTS TESTED AND VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    test_full_api()
