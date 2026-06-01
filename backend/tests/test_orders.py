from fastapi.testclient import TestClient


def create_customer(client: TestClient) -> int:
    response = client.post(
        "/api/v1/customers",
        json={"full_name": "Grace Hopper", "email": "grace@example.com", "phone": "+1 555 0200"},
    )
    return response.json()["data"]["id"]


def create_product(client: TestClient, sku: str, quantity: int = 10) -> int:
    response = client.post(
        "/api/v1/products",
        json={"name": f"Product {sku}", "sku": sku, "price": "25.50", "quantity_in_stock": quantity},
    )
    return response.json()["data"]["id"]


def test_order_creation_deducts_inventory(client: TestClient) -> None:
    customer_id = create_customer(client)
    product_id = create_product(client, "SKU-ORDER", 8)

    response = client.post(
        "/api/v1/orders",
        json={"customer_id": customer_id, "items": [{"product_id": product_id, "quantity": 3}]},
    )

    assert response.status_code == 201
    order = response.json()["data"]
    assert order["total_amount"] == "76.50"
    assert order["items"][0]["subtotal"] == "76.50"

    product = client.get(f"/api/v1/products/{product_id}").json()["data"]
    assert product["quantity_in_stock"] == 5


def test_order_creation_rejects_insufficient_inventory(client: TestClient) -> None:
    customer_id = create_customer(client)
    product_id = create_product(client, "SKU-LOW", 2)

    response = client.post(
        "/api/v1/orders",
        json={"customer_id": customer_id, "items": [{"product_id": product_id, "quantity": 3}]},
    )

    assert response.status_code == 400
    assert response.json()["message"] == "Insufficient inventory for product SKU-LOW"
    product = client.get(f"/api/v1/products/{product_id}").json()["data"]
    assert product["quantity_in_stock"] == 2


def test_dashboard_counts(client: TestClient) -> None:
    customer_id = create_customer(client)
    product_id = create_product(client, "SKU-DASH", 5)
    client.post("/api/v1/orders", json={"customer_id": customer_id, "items": [{"product_id": product_id, "quantity": 1}]})

    response = client.get("/api/v1/dashboard")
    assert response.status_code == 200
    assert response.json()["data"] == {
        "total_products": 1,
        "total_customers": 1,
        "total_orders": 1,
        "low_stock_products": 1,
    }
