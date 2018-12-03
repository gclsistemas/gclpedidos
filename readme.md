GCL PEDIDOS

<p>
Configurar cors
06 Tutorial de Angular: CORS solución en el cliente de un app de Angular
https://www.youtube.com/watch?v=zq48aSVEwbQ
</p>

Webservice functions:
<p>
download_productos_empresa(empresa_id: number) retorna array de productos con el siguiente formato:<br>
productos: [<br/>
  {<br/>
  cantidad: null<br/>
  id: id<br/>
  marca: "marca"<br/>
  nombre: "nombre"<br/>
  precio: precio<br/>
  precio_id: precio_id<br/>
  presentacion: "presentacion"<br/>
  presentacion_id: presentacion_id<br/>
  seleccionado: 0 ó 1<br/>
  },<br/>
  {....},<br/>
  {....}
]
</p>
<p>
download_pedidos_cliente(cliente_id: number) retorna array de pedidos del cliente con el siguiente formato:<br>
pedidos: [<br>
	{<br>
		"id": id,<br>
		"fecha": "yyyy-mm-dd hh:mm:ii",<br>
		"cliente_id": cliente_id,<br>
		"cliente": "apellido y nombre",<br>
		"cantidad": "cantidad",<br>
		"importeTotal": importe,<br>
		"cancelado": 1 ó 0,<br>
		"pagado": 1 ó 0,<br>
		"embalada": 1 ó 0,<br>
		"enviado": 1 ó 0,<br>
		"fechaCancelado": null ó "yyyy-mm-dd hh:mm:ii",<br>
		"fechaPago": null ó "yyyy-mm-dd hh:mm:ii",<br>
		"fechaEmbalada": null ó "yyyy-mm-dd hh:mm:ii",<br>
		"fechaEnviado": null ó "yyyy-mm-dd hh:mm:ii"<br>
	},<br>
	{...},<br>
]<br>
</p>
