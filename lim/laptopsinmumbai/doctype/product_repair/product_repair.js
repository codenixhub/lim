// // Copyright (c) 2025, CodeNixHub and contributors
// // For license information, please see license.txt

// // frappe.ui.form.on("Product Repair", {
// // 	refresh(frm) {

// // 	},
// // });
// frappe.ui.form.on("Product Repair", {
//     refresh(frm) {
//         calculate_total_repair_cost(frm);
//     }
// });

// frappe.ui.form.on("repair_item", {
//     cost(frm, cdt, cdn) {
//         calculate_total_repair_cost(frm);
//     },
//     repair_item_add(frm, cdt, cdn) {
//         calculate_total_repair_cost(frm);
//     },
//     repair_item_remove(frm, cdt, cdn) {
//         calculate_total_repair_cost(frm);
//     }
// });

// function calculate_total_repair_cost(frm) {
//     let total = 0;
//     if (frm.doc.repair_item && frm.doc.repair_item.length) {
//         for (let row of frm.doc.repair_item) {
//             total += (row.cost || 0);
//         }
//     }
//     frm.set_value("total_repair_cost", total);

//     let purchase_price = frm.doc.purchase_price || 0;
//     let final_cost = purchase_price + total;
//     frm.set_value("final_cost", final_cost);

//     frm.refresh_field("total_repair_cost");
//     frm.refresh_field("final_cost");
// }


// frappe.ui.form.on('Product Repair', {
//     item_code: function(frm) {
//         // 1. Jab item_code change ho, purchase_invoice field ko clear kar do
//         frm.set_value('purchase_invoice', null);

//         // 2. Agar item_code set hai (user ne koi item choose kiya hai)
//         if(frm.doc.item_code) {
//             // 3. Backend method call karo jo item ke against Purchase Invoice list laata hai
//             frappe.call({
//                 method: "lim.laptopsinmumbai.doctype.product_repair.product_repair.get_purchase_invoices_by_item",
//                 args: { item_code: frm.doc.item_code },
//                 callback: function(r) {
//                     if(r.message) {
//                         // 4. Purchase Invoice field ke dropdown ko filter karo sirf un invoices pe jinka naam us list mein ho
//                         frm.set_query('purchase_invoice', () => {
//                             return {
//                                 filters: {
//                                     name: ['in', r.message]
//                                 }
//                             };
//                         });
//                     }
//                 }
//             });
//         } else {
//             // 5. Agar item_code empty hua, to purchase_invoice field ke dropdown filters hata do (ya default kar do)
//             frm.set_query('purchase_invoice', () => {
//                 return {};
//             });
//         }
//     }
// });


frappe.ui.form.on("Product Repair", {
    refresh(frm) {
        calculate_total_repair_cost(frm);
    },

    item_code(frm) {
        // Jab item_code change ho to purchase_invoice ko clear karo
        frm.set_value('purchase_invoice', null);

        if (frm.doc.item_code) {
            // Backend call karke item ke related Purchase Invoice IDs lao
            frappe.call({
                method: "lim.laptopsinmumbai.doctype.product_repair.product_repair.get_purchase_invoices_by_item",
                args: { item_code: frm.doc.item_code },
                callback: function(r) {
                    if (r.message) {
                        // purchase_invoice field ke dropdown ko filter karo uss list ke invoices tak
                        frm.set_query('purchase_invoice', () => {
                            return {
                                filters: {
                                    name: ['in', r.message]
                                }
                            };
                        });
                    }
                }
            });
        } else {
            // Agar item_code blank hua to filter hatao purchase_invoice se
            frm.set_query('purchase_invoice', () => {
                return {};
            });
        }
    }
});

frappe.ui.form.on("repair_item", {
    cost(frm, cdt, cdn) {
        calculate_total_repair_cost(frm);
    },
    repair_item_add(frm, cdt, cdn) {
        calculate_total_repair_cost(frm);
    },
    repair_item_remove(frm, cdt, cdn) {
        calculate_total_repair_cost(frm);
    }
});

// Total repair cost aur final cost calculate karne wala function
function calculate_total_repair_cost(frm) {
    let total = 0;
    if (frm.doc.repair_item && frm.doc.repair_item.length) {
        for (let row of frm.doc.repair_item) {
            total += (row.cost || 0);
        }
    }
    frm.set_value("total_repair_cost", total);

    let purchase_price = frm.doc.purchase_price || 0;
    let final_cost = purchase_price + total;
    frm.set_value("final_cost", final_cost);

    frm.refresh_field("total_repair_cost");
    frm.refresh_field("final_cost");
}
