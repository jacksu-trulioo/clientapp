export function createWithWizardHOC(WizardStateProvider: React.FC) {
  function withWizardState<P extends object = object>(Component: React.FC<P>) {
    const wrapped: React.FC<P> = (props: P) => {
      return (
        <WizardStateProvider>
          <Component {...props} />
        </WizardStateProvider>
      )
    }

    wrapped.displayName = `WithWizardStateProvider(${
      Component.displayName || "Component"
    })`

    return wrapped
  }

  return withWizardState
}
