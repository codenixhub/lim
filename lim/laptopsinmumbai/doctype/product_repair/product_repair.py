# Copyright (c) 2025, CodeNixHub and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class ProductRepair(Document):
	pass
import frappe

@frappe.whitelist()
def get_purchase_invoices_by_item(item_code):
    if not item_code:
        return []

    invoices = frappe.db.sql("""
        SELECT DISTINCT pi.name
        FROM `tabPurchase Invoice` pi
        JOIN `tabPurchase Invoice Item` pii ON pii.parent = pi.name
        WHERE pii.item_code = %s AND pi.docstatus = 1
        ORDER BY pi.posting_date DESC, pi.name DESC
        LIMIT 10
    """, item_code, as_dict=1)

    return [d['name'] for d in invoices]
