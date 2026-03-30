# Auditoría de Mapeo del Target `compressive_strength`

Para cada dataset se determina si `compressive_strength` existe directamente, como sinónimo técnicamente válido, como derivación legítima, o no existe.


## ✅ Target Directo

### TensiondataB.csv

- **Veredicto**: `direct_target`
- **Razón**: Columna 'stress[mpa]' mapea directamente a compressive_strength.
- **Columna directa encontrada**: `stress[mpa]`
- **Sinónimo encontrado**: `ninguno`
- **Derivación posible**: False

### TensiondataA.csv

- **Veredicto**: `direct_target`
- **Razón**: Columna 'stress[mpa]' mapea directamente a compressive_strength.
- **Columna directa encontrada**: `stress[mpa]`
- **Sinónimo encontrado**: `ninguno`
- **Derivación posible**: False


## ⚠️ Target Derivado con Validez Técnica


## ❌ Sin Target Válido

### FDM_Dataset.csv

- **Veredicto**: `no_valid_target`
- **Razón**: Sin target directo, sinónimo aplicable ni derivación técnicamente válida.
- **Columna directa encontrada**: `ninguna`
- **Sinónimo encontrado**: `ninguno`
- **Derivación posible**: False

### Compressivedata.csv

- **Veredicto**: `no_valid_target`
- **Razón**: Sin target directo, sinónimo aplicable ni derivación técnicamente válida.
- **Columna directa encontrada**: `ninguna`
- **Sinónimo encontrado**: `ninguno`
- **Derivación posible**: False

### Propiedades_Extraidas.csv

- **Veredicto**: `no_valid_target`
- **Razón**: Dataset mezcla ensayos de tracción. 'max_force' no puede asumir representar compresión sin separación explícita.
- **Columna directa encontrada**: `ninguna`
- **Sinónimo encontrado**: `max_force`
- **Derivación posible**: True
- **Nota de derivación**: Derivable via (max_force / transverse_area)

### data.csv

- **Veredicto**: `no_valid_target`
- **Razón**: Columna 'tension_strenght' mide resistencia a tracción, no compresión. Usarla como compressive_strength sería una confusión de ensayo.
- **Columna directa encontrada**: `ninguna`
- **Sinónimo encontrado**: `tension_strenght`
- **Derivación posible**: False
