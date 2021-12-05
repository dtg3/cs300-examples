using UnityEngine;

public class AnimationStateController : MonoBehaviour
{
    private Animator animator;
    private float velocity = 0.0f;
    [SerializeField] private float acceleration = 0.1f;
    [SerializeField] private float deceleration = 0.5f;

    // For the oldBooleanAnimation
    private int isWalkingHash;
    private int isRunningHash;
    int velocityHash;
    // Start is called before the first frame update
    void Start()
    {
        animator = GetComponent<Animator>();

        // For the oldBooleanAnimation
        isWalkingHash = Animator.StringToHash("isWalking");
        isRunningHash = Animator.StringToHash("isRunning");
        velocityHash = Animator.StringToHash("Velocity");
    }

    void oldBooleanAnimation(bool forwardPressed, bool runPressed)
    {
        bool isWalking = animator.GetBool(isWalkingHash);
        bool isRunning = animator.GetBool(isRunningHash);

        if (!isWalking && forwardPressed)
        {
            animator.SetBool("isWalking", true);
        }

        if (isWalking && !forwardPressed)
        {
            animator.SetBool("isWalking", false);
        }

        if (!isRunning && (forwardPressed &&  runPressed))
        {
            animator.SetBool(isRunningHash, true);
        }

        if (isRunning && (!forwardPressed || !runPressed)) {
            animator.SetBool(isRunningHash, false);
        }
    }

    // Update is called once per frame
    void Update()
    {
        bool forwardPressed = Input.GetKey("w");
        bool shiftPressed = Input.GetKey("left shift");

        if (forwardPressed && shiftPressed && velocity < 1.0f)
        {
            velocity += Time.deltaTime * acceleration;
        }

        if (forwardPressed && !shiftPressed)
        {
            if (velocity < 0.5f)
                velocity += Time.deltaTime * acceleration;
            
            if (velocity > 0.5f)
                velocity -= Time.deltaTime * deceleration;
            
        }

        if (!forwardPressed && velocity > 0.0f)
        {
            velocity -= Time.deltaTime * deceleration;
        }

        if (!forwardPressed && velocity < 0.0f)
        {
            velocity = 0.0f;
        }

        animator.SetFloat(velocityHash, velocity);
    }
}
